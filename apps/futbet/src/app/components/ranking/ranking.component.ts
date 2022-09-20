import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngxs/store';
import { combineLatest, map, Observable } from 'rxjs';

import { Ranking } from '../../core';
import { ResultsService } from '../../services';
import { ResultsState } from '../../store';

@Component({
  selector: 'futbet-ranking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ResultsService],
})
export class RankingComponent implements OnInit {
  _store = inject(Store);
  resultsService = inject(ResultsService);
  data$!: Observable<Ranking[]>;

  ngOnInit(): void {
    this.data$ = combineLatest([
      this._store.select(ResultsState.games),
      this._store.select(ResultsState.results),
    ]).pipe(
      map(([games, results]) => {
        return this.resultsService.generateRanking(games, results);
      })
    );
  }
}
