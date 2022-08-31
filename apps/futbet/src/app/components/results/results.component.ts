import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'futbet-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsComponent {
  myResults = false;
  constructor(private _router: Router) {
    if (this._router.url === '/dashboard/my-results') {
      this.myResults = true;
    } else {
      this.myResults = false;
    }
  }
}
