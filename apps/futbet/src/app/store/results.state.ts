import 'firebase/auth';

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  Emitted,
  NgxsFirestoreConnect,
  StreamEmitted,
} from '@ngxs-labs/firestore-plugin';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { tap, throwError } from 'rxjs';

import { Game, Results } from '../core/result.model';
import { GamesFirestoreService } from '../services/games-firestore.service';
import { ResultsFirestoreService } from '../services/results-firestore.service';
import { Create, GetAll, GetUserResults, SeedGames } from './results.actions';
import { ResultsStateModel } from './results.model';

@State<ResultsStateModel>({
  name: 'results',
  defaults: {
    userResults: undefined,
    results: [],
    ranking: [],
    games: [],
  },
})
@Injectable()
export class ResultsState implements NgxsOnInit {
  @Selector() static results(state: ResultsStateModel) {
    return state.results;
  }

  @Selector() static userResults(state: ResultsStateModel) {
    return state.userResults;
  }

  @Selector() static ranking(state: ResultsStateModel) {
    return state.ranking;
  }

  constructor(
    private resultsFs: ResultsFirestoreService,
    private gamesFs: GamesFirestoreService,
    private ngxsFirestoreConnect: NgxsFirestoreConnect,
    private afs: AngularFirestore
  ) {}

  ngxsOnInit() {
    // query collection
    this.ngxsFirestoreConnect.connect(GetAll, {
      to: () => this.resultsFs.collection$(),
    });
  }

  @Action(StreamEmitted(GetAll))
  getAllEmitted(
    ctx: StateContext<ResultsStateModel>,
    { payload }: Emitted<GetAll, Results[]>
  ) {
    ctx.patchState({ results: payload });
  }

  @Action(GetUserResults)
  getUserResults(
    ctx: StateContext<ResultsStateModel>,
    { payload }: GetUserResults
  ) {
    const state = ctx.getState();
    const results = [...state.results];
    const idx = results.findIndex((result) => result.userId === payload);
    if (idx !== -1) {
      const userResults = results[idx];
      ctx.patchState({ userResults });
    } else {
      ctx.patchState({ userResults: undefined });
    }
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
    // return this.gamesFs.collection$(ref => {
    //   let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
    //   if (size) { query = query.where('size', '==', size) };
    //   if (color) { query = query.where('color', '==', color) };
    //   return query;);
  }
}
