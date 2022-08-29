import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'futbet-verify-email',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailComponent {}
