import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'futbet-confirm-email',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmailComponent {}
