import 'firebase/auth';

import { Injectable } from '@angular/core';
import {
  Emitted,
  NgxsFirestoreConnect,
  StreamEmitted,
} from '@ngxs-labs/firestore-plugin';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';

import { Results } from '../core/result.model';
import { ResultsFirestoreService } from '../services/results-firestore.service';
import { Create, GetAll } from './results.actions';
import { ResultsStateModel } from './results.model';
import { tap } from 'rxjs';

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

  ngxsOnInit(ctx: StateContext<ResultsStateModel>) {
    // query collection
    this.ngxsFirestoreConnect.connect(GetAll, {
      to: () => this.resultsFs.collection$(),
    });

    ctx.dispatch(new GetAll());
  }

  @Action(StreamEmitted(GetAll))
  getAllEmitted(
    ctx: StateContext<ResultsStateModel>,
    { payload }: Emitted<GetAll, Results[]>
  ) {
    ctx.patchState({ results: payload });
  }

  //Create
  @Action(Create)
  create(ctx: StateContext<ResultsStateModel>, { payload }: Create) {
    return this.resultsFs.create$(payload).pipe(
      tap(() => {
        const userResults = payload;
        ctx.patchState({ userResults });
      })
    );
  }
}
