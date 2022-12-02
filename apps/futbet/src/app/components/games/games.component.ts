import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngxs/store';
import { combineLatest, map, Observable } from 'rxjs';

import { AuthState, Game } from '../../core';
import { GetAllGames, ResultsState } from '../../store';

@Component({
  selector: 'futbet-games',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesComponent implements OnInit {
  games$!: Observable<Game[]>;

  constructor(private _store: Store) {}

  ngOnInit(): void {
    this._store.dispatch(new GetAllGames());

    this.games$ = combineLatest([
      this._store.select(ResultsState.games),
      this._store.select(AuthState.loggedIn),
    ]).pipe(
      map(([games, loggedIn]) => {
        return games;
      })
    );
  }
}
