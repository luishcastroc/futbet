import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { map, Observable, switchMap } from 'rxjs';

import { Game, Results } from '../../core';
import { AuthState } from '../../core/auth/store/auth.state';
import {
  ClearUserResults,
  GetAll,
  GetAllGames,
  GetAllUsers,
  ResultsState,
} from '../../store';

@Component({
  selector: 'futbet-results',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsComponent implements OnInit, OnDestroy {
  private _store = inject(Store);
  results$!: Observable<Results[]>;
  games$!: Observable<Game[]>;
  displayName$!: Observable<string | undefined>;
  userIndex = 0;

  ngOnInit(): void {
    this._store.dispatch([new GetAll(), new GetAllUsers(), new GetAllGames()]);
    this.games$ = this._store.select(ResultsState.games);
    this.results$ = this._store.select(AuthState.uid).pipe(
      map(id => id),
      switchMap(id => {
        return this._store
          .select(ResultsState.results)
          .pipe(map(results => results.filter(result => result.userId !== id)));
      }),
      switchMap(results => {
        return this._store.select(ResultsState.users).pipe(
          map(users => {
            if (users) {
              return results.map(result => {
                const displayName = users.find(
                  user => user.uid === result.userId
                )?.displayName;
                return { ...result, displayName };
              });
            } else {
              return [];
            }
          })
        );
      })
    );
  }

  changeUserResults($event: MatSelectChange) {
    this.userIndex = $event.value;
  }

  back() {
    this._store.dispatch(new Navigate(['/dashboard']));
  }

  ngOnDestroy(): void {
    this._store.dispatch(new ClearUserResults());
  }
}
