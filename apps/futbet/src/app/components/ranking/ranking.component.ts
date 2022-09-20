import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Ranking } from '../../core';
import { ResultsService } from '../../services';
import { ClearRanking, GenerateRanking, ResultsState } from '../../store';

@Component({
  selector: 'futbet-ranking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ResultsService],
})
export class RankingComponent implements OnInit, OnDestroy {
  _store = inject(Store);
  resultsService = inject(ResultsService);
  data$!: Observable<Ranking[]>;

  ngOnInit(): void {
    this.data$ = this._store.select(ResultsState.ranking);
    this._store.dispatch(new GenerateRanking());
  }

  ngOnDestroy(): void {
    this._store.dispatch(new ClearRanking());
  }
}
