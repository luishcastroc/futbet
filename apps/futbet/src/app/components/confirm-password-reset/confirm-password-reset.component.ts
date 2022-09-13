import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'futbet-confirm-password-reset',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-password-reset.component.html',
  styleUrls: ['./confirm-password-reset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmPasswordResetComponent {}
