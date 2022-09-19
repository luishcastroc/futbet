import 'firebase/auth';

import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  Emitted,
  NgxsFirestoreConnect,
  StreamEmitted,
} from '@ngxs-labs/firestore-plugin';
import {
  Action,
  NgxsOnInit,
  Selector,
  State,
  StateContext,
  Store,
} from '@ngxs/store';
import { tap, throwError } from 'rxjs';

import { Game, Results, UsersFirestoreService } from '../core';
import { User } from '../core/auth/user.model';
import { GamesFirestoreService, ResultsFirestoreService } from '../services';
import {
  ClearResultsState,
  ClearUserResults,
  Create,
  GetAll,
  GetAllGames,
  GetAllUsers,
  GetUserResults,
  SeedGames,
} from './results.actions';
import { ResultsStateModel } from './results.model';

@State<ResultsStateModel>({
  name: 'results',
  defaults: {
    userResults: undefined,
    results: [],
    ranking: [],
    games: [],
    users: [],
  },
})
@Injectable()
export class ResultsState implements NgxsOnInit {
  private resultsFs = inject(ResultsFirestoreService);
  private gamesFs = inject(GamesFirestoreService);
  private usersFs = inject(UsersFirestoreService);
  private ngxsFirestoreConnect = inject(NgxsFirestoreConnect);
  private afs = inject(AngularFirestore);
  private _store = inject(Store);

  @Selector() static results(state: ResultsStateModel) {
    return state.results;
  }

  @Selector() static userResults(state: ResultsStateModel) {
    return state.userResults;
  }

  @Selector() static ranking(state: ResultsStateModel) {
    return state.ranking;
  }

  @Selector() static games(state: ResultsStateModel) {
    return state.games;
  }

  @Selector()
  static users(state: ResultsStateModel) {
    return state.users;
  }

  ngxsOnInit() {
    // query collection
    this.ngxsFirestoreConnect.connect(GetAll, {
      to: () => this.resultsFs.collection$(),
    });

    this.ngxsFirestoreConnect.connect(GetAllGames, {
      to: () => this.gamesFs.collection$(),
    });

    this.ngxsFirestoreConnect.connect(GetAllUsers, {
      to: () => this.usersFs.collection$(),
    });
  }

  @Action(StreamEmitted(GetAll))
  getAllEmitted(
    ctx: StateContext<ResultsStateModel>,
    { payload }: Emitted<GetAll, Results[]>
  ) {
    ctx.patchState({ results: payload });
  }

  @Action(StreamEmitted(GetAllGames))
  getAllGamesEmitted(
    ctx: StateContext<ResultsStateModel>,
    { payload }: Emitted<GetAllGames, Game[]>
  ) {
    const games = payload.sort((a, b) => a.id - b.id);
    ctx.patchState({ games });
  }

  @Action(StreamEmitted(GetAllUsers))
  getAllUsersEmitted(
    ctx: StateContext<ResultsStateModel>,
    { payload }: Emitted<GetAllUsers, User[]>
  ) {
    const users = payload;
    ctx.patchState({ users });
  }

  @Action(GetUserResults)
  getUserResults(
    ctx: StateContext<ResultsStateModel>,
    { payload }: GetUserResults
  ) {
    return this.resultsFs
      .collection$(ref => ref.where('userId', '==', payload))
      .pipe(
        tap(result => {
          if (result.length > 0) {
            ctx.patchState({ userResults: result[0] });
          }
        })
      );
  }

  //Create
  @Action(Create)
  create(ctx: StateContext<ResultsStateModel>, { payload }: Create) {
    const state = ctx.getState();
    if (state.userResults) {
      return throwError(
        () => new Error('Los Resultados ya existen, Verificar.')
      );
    } else {
      return this.resultsFs.create$(payload).pipe(
        tap(() => {
          const userResults = payload;
          ctx.patchState({ userResults });
        })
      );
    }
  }

  //Seed Games
  @Action(SeedGames)
  seedGames(
    { getState, patchState }: StateContext<ResultsStateModel>,
    { payload }: SeedGames
  ) {
    return this.gamesFs.create$(payload).pipe(
      tap(() => {
        const state = getState();
        let games: Game[] = [];
        if (state.games.length > 0) {
          games = [...state.games];
          games.push(payload);
        } else {
          games.push(payload);
        }
        patchState({ games });
      })
    );
  }

  @Action(ClearResultsState)
  clearResultsState({ patchState }: StateContext<ResultsStateModel>) {
    patchState({ games: [], ranking: [], results: [], userResults: undefined });
  }

  @Action(ClearUserResults)
  clearUserResults({ patchState }: StateContext<ResultsStateModel>) {
    patchState({ userResults: undefined });
  }
}
