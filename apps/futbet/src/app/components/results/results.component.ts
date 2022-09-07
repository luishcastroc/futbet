import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

import { AuthState } from '../../core/auth/store/auth.state';
import { Results } from '../../core/result.model';
import { Create } from '../../store/results.actions';
import { ResultsState } from '../../store/results.state';

@Component({
  selector: 'futbet-results',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsComponent {
  myResults = false;
  userId$!: Observable<string>;
  userResults$!: Observable<Results | undefined>;

  constructor(private _router: Router, private _store: Store) {
    if (this._router.url === '/dashboard/my-results') {
      this.myResults = true;
    } else {
      this.myResults = false;
    }

    this.userId$ = this._store.select(AuthState.uid);
    this.userResults$ = this._store.select(ResultsState.userResults);
  }

  create(userId: string): void {
    const results: Results = {
      userId,
      generationDate: DateTime.now().toJSDate(),
      updateDate: DateTime.now().toJSDate(),
      results: [
        {
          id: '1',
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
}
