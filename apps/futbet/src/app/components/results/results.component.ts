import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Actions, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AuthState } from '../../core/auth/store/auth.state';
import { GetAll } from '../../store';

@Component({
  selector: 'futbet-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsComponent implements OnInit {
  private _store = inject(Store);
  private actions$ = inject(Actions);

  userId$: Observable<string | null> = this._store.select(AuthState.uid);

  ngOnInit(): void {
    this._store.dispatch(new GetAll());
  }
}
