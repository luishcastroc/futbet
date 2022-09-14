import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Actions, ofActionCompleted, Store } from '@ngxs/store';
import { DateTime } from 'luxon';
import { Observable, Subject, takeUntil } from 'rxjs';

import { AuthState } from '../../core/auth/store/auth.state';
import { Results } from '../../core/result.model';
import { Create, GetAll, GetUserResults } from '../../store/results.actions';
import { ResultsState } from '../../store/results.state';

@Component({
  selector: 'futbet-results',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsComponent implements OnInit, OnDestroy {
  myResults = false;
  userId$!: Observable<string | null>;
  userResults$!: Observable<Results | undefined>;
  private _unsubscribeAll: Subject<unknown> = new Subject<unknown>();
  today = DateTime.now().toLocal();
  wcDate = DateTime.fromISO('2022-11-20');

  dateBeforeWc = this.today < this.wcDate;

  constructor(
    private _router: Router,
    private _store: Store,
    public actions$: Actions,
    private _cdr: ChangeDetectorRef,
    private _toast: HotToastService
  ) {
    if (this._router.url === '/dashboard/my-results') {
      this.myResults = true;
    } else {
      this.myResults = false;
    }

    this.userId$ = this._store.select(AuthState.uid);
    this.userResults$ = this._store.select(ResultsState.userResults);
  }

  ngOnInit(): void {
    if (this.myResults) {
      this._store.dispatch(
        new GetUserResults(this._store.selectSnapshot(AuthState.uid))
      );
    } else {
      this._store.dispatch(new GetAll());
    }

    this.actions$
      .pipe(ofActionCompleted(Create), takeUntil(this._unsubscribeAll))
      .subscribe(result => {
        const { error, successful } = result.result;
        const { action } = result;
        let message;

        this._cdr.markForCheck();
        if (error) {
          this._toast.error(error.message, {
            duration: 4000,
            position: 'bottom-center',
          });
        }
        if (successful) {
          if (action instanceof Create) {
            message = 'Resultados agregados exitosamente.';
            this._toast.success(message, {
              duration: 4000,
              position: 'bottom-center',
            });
          }
        }
      });
  }

  create(userId: string): void {
    const results: Results = {
      userId,
      generationDate: DateTime.now().toJSDate(),
      updateDate: DateTime.now().toJSDate(),
      results: [
        {
          id: 1,
          homeTeamId: 1,
          awayTeamId: 2,
          homeScore: 1,
          awayScore: 2,
          goldenBall: false,
        },
      ],
    };
    this._store.dispatch(new Create(results));
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
