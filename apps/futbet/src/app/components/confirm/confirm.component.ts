import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'futbet-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmComponent {}
