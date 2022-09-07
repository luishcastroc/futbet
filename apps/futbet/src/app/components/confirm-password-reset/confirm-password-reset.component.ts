import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'futbet-confirm-password-reset',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-password-reset.component.html',
  styleUrls: ['./confirm-password-reset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmPasswordResetComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
