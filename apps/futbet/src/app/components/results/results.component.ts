import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Actions, Store } from '@ngxs/store';
import { map, Observable, switchMap } from 'rxjs';

import { Results } from '../../core';
import { AuthState } from '../../core/auth/store/auth.state';
import { ClearUserResults, GetAll, ResultsState } from '../../store';

@Component({
  selector: 'futbet-results',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsComponent implements OnInit, OnDestroy {
  private _store = inject(Store);
  private actions$ = inject(Actions);
  results$!: Observable<Results[]>;
  games$ = this._store.select(ResultsState.games);
  userIndex = 0;

  userId$: Observable<string | null> = this._store.select(AuthState.uid);

  ngOnInit(): void {
    this._store.dispatch(new GetAll());

    this.results$ = this._store.select(AuthState.uid).pipe(
      map(id => id),
      switchMap(id => {
        return this._store
          .select(ResultsState.results)
          .pipe(map(results => results.filter(result => result.userId !== id)));
      })
    );
  }

  ngOnDestroy(): void {
    this._store.dispatch(new ClearUserResults());
  }
}
