import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HotToastService } from '@ngneat/hot-toast';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Store } from '@ngxs/store';
import { DateTime } from 'luxon';
import { map, mergeMap, Observable, Subject, takeUntil, tap } from 'rxjs';

import { AuthState, Game, Results } from '../../core';
import { ResultsService } from '../../services';
import {
  Create,
  GetAllGames,
  GetUserResults,
  ResultsState,
  Update,
} from '../../store';

@Component({
  selector: 'futbet-my-results',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './my-results.component.html',
  styleUrls: ['./my-results.component.scss'],
  providers: [ResultsService],
  encapsulation: ViewEncapsulation.None,
})
export class MyResultsComponent implements OnInit, OnDestroy {
  private _store = inject(Store);
  private _resultsService = inject(ResultsService);
  private _cdr = inject(ChangeDetectorRef);
  private _toast = inject(HotToastService);
  private _unsubscribeAll: Subject<unknown> = new Subject<unknown>();
  private _fb = inject(FormBuilder);
  public actions$ = inject(Actions);

  userId!: string;
  userResults$!: Observable<Results | undefined>;
  games: Game[] = [];
  today = DateTime.now().toLocal();
  wcDate = DateTime.fromISO('2022-11-20'); //world cup starts on 2022-11-20
  resultsForm!: FormGroup;
  resultsGroup!: FormGroup;
  dateBeforeWc = this.today < this.wcDate;
  edit = false;
  loading = false;

  get results() {
    return this.resultsForm.get('results') as FormArray;
  }

  ngOnInit(): void {
    this.resultsForm = this.generateResultsForm();

    this.userResults$ = this._store.select(AuthState.uid).pipe(
      tap(id => {
        if (id) {
          this._store.dispatch([
            new GetUserResults(this._store.selectSnapshot(AuthState.uid)),
            new GetAllGames(),
          ]);
        }
      }),
      mergeMap(id =>
        this._store.select(AuthState.displayName).pipe(
          map(displayName => {
            return { id, displayName };
          })
        )
      ),
      mergeMap(({ id, displayName }) =>
        this._store.select(ResultsState.userResults).pipe(
          mergeMap(userResults =>
            this._store.select(ResultsState.games).pipe(
              map(games => {
                this.games = games;
                if (userResults) {
                  const resultsArr = this.results;
                  if ((resultsArr.value as []).length === 0) {
                    userResults.results.forEach(() => {
                      this.resultsGroup = this.getResultsGroup();
                      resultsArr.push(this.resultsGroup);
                    });
                  }
                  this.resultsForm.patchValue(userResults);
                  this.edit = true;
                  if (this.today >= this.wcDate) {
                    this.resultsForm.disable();
                  }
                } else {
                  const resultsArr = this.results;
                  if (
                    games.length > 0 &&
                    (resultsArr.value as []).length === 0
                  ) {
                    games.forEach((game, i) => {
                      this.resultsGroup = this.getResultsGroup();
                      resultsArr.push(this.resultsGroup);
                      resultsArr.at(i).patchValue(game);
                      resultsArr.at(i).get('homeScore')?.patchValue(null);
                      resultsArr.at(i).get('awayScore')?.patchValue(null);
                    });
                  }
                }
                this.resultsForm.get('userId')?.patchValue(id);
                this.resultsForm.get('displayName')?.patchValue(displayName);
                return userResults;
              })
            )
          )
        )
      )
    );

    this.subscribeToActions();
  }

  subscribeToActions(): void {
    this.actions$
      .pipe(
        ofActionCompleted(Create, Update),
        takeUntil(this._unsubscribeAll),
        tap(result => {
          this.loading = false;
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
            }
            if (action instanceof Update) {
              message = 'Resultados actualizados exitosamente.';
            }
            this._toast.success(message, {
              duration: 4000,
              position: 'bottom-center',
            });
          }
        })
      )
      .subscribe();
  }

  create(): void {
    const message = this._resultsService.checkGoldenBall(this.results);
    if (message) {
      this._toast.warning(message, {
        autoClose: false,
        dismissible: true,
        icon: '❎',
      });
    } else {
      this.loading = true;
      const results = this.resultsForm.value as Results;
      delete results.id;
      this._store.dispatch(new Create(results));
    }
  }

  update(): void {
    this.loading = true;
    this._store.dispatch(new Update(this.resultsForm.value));
  }

  cancel(): void {
    if (this.edit) {
      this._store.dispatch(new Navigate(['/dashboard']));
    } else {
      this.resetResults();
    }
  }

  resetResults() {
    for (const control of this.results.controls) {
      if (control instanceof FormGroup) {
        control.get('homeScore')?.reset();
        control.get('awayScore')?.reset();
      }
    }
  }

  goldenBall(index: number, matchDay: number) {
    if (this.results.at(index).get('goldenBall')?.value) {
      this.results.at(index).get('goldenBall')?.patchValue(false);
    } else {
      for (const i in this.results.controls) {
        const group = this.results.at(Number(i));
        if (group) {
          const matchDayCtrl = group.get('matchDay');
          const goldenBall = group.get('goldenBall');
          if (matchDayCtrl && goldenBall) {
            if (matchDayCtrl.value === matchDay) {
              if (index !== Number(i)) {
                goldenBall.patchValue(false);
              } else {
                goldenBall.patchValue(true);
              }
            }
          }
        }
      }
    }
  }

  generateResultsForm(): FormGroup {
    const resultsForm = this._fb.group({
      id: [Validators.required],
      userId: ['', Validators.required],
      generationDate: [DateTime.now().toLocal().toJSDate()],
      results: this._fb.array([]),
      updateDate: [DateTime.now().toLocal().toJSDate()],
      displayName: ['', Validators.required],
    });

    return resultsForm;
  }

  getResultsGroup(): FormGroup {
    return this._fb.group({
      id: [null, Validators.required],
      homeTeamId: [null, Validators.required],
      awayTeamId: [null, Validators.required],
      homeScore: [null, Validators.required],
      awayScore: [null, Validators.required],
      matchDay: [Validators.required],
      goldenBall: [false],
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
