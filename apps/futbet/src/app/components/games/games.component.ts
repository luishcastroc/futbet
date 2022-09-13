import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { GetAllGames, SeedGames } from '../../store/results.actions';
import { Game } from '../../core/result.model';
import { ResultsState } from '../../store/results.state';
import { Observable, tap } from 'rxjs';
import { worldCupGames } from '../../core/world-cup';

@Component({
  selector: 'futbet-games',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesComponent implements OnInit {
  games$!: Observable<Game[]>;

  constructor(private _store: Store) {
    this.games$ = this._store.select(ResultsState.games).pipe(
      tap(games => {
        if (games && games.length === 0) {
          worldCupGames.forEach(wcG => {
            this._store.dispatch(new SeedGames(wcG));
          });
        }
      })
    );
  }

  ngOnInit(): void {
    this._store.dispatch(new GetAllGames());
  }
}
