import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ConfirmPasswordResetComponent } from '../confirm-password-reset/confirm-password-reset.component';

@Component({
  selector: 'futbet-confirm',
  standalone: true,
  imports: [CommonModule, ConfirmPasswordResetComponent],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmComponent {
  private _activatedRoute = inject(ActivatedRoute);
  mode = this._activatedRoute.snapshot.queryParams['mode'];
  code = this._activatedRoute.snapshot.queryParams['oobCode'];
}
