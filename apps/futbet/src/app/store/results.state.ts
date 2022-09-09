import 'firebase/auth';

import { Injectable } from '@angular/core';
import {
  Emitted,
  NgxsFirestoreConnect,
  StreamEmitted,
} from '@ngxs-labs/firestore-plugin';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { tap, throwError } from 'rxjs';

import { Results } from '../core/result.model';
import { ResultsFirestoreService } from '../services/results-firestore.service';
import { Create, GetAll, GetUserResults } from './results.actions';
import { ResultsStateModel } from './results.model';

@State<ResultsStateModel>({
  name: 'results',
  defaults: {
    userResults: undefined,
    results: [],
    ranking: [],
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
    private ngxsFirestoreConnect: NgxsFirestoreConnect
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
}
