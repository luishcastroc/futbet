import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';

import { Logout } from '../../core/auth/store/auth.actions';
import { AuthStateModel } from '../../core/auth/store/auth.model';
import { AuthState } from '../../core/auth/store/auth.state';

@Component({
  selector: 'futbet-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnDestroy {
  destroyed = new Subject<void>();
  currentScreenSize!: string;
  user$!: Observable<AuthStateModel>;
  hideGreeting = false;

  // Create a map to display breakpoint names for demonstration purposes.
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  constructor(
    private _store: Store,
    _breakpointObserver: BreakpointObserver,
    private _cdr: ChangeDetectorRef
  ) {
    this.user$ = this._store.select(AuthState.user);

    _breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize =
              this.displayNameMap.get(query) ?? 'Unknown';
            if (
              this.currentScreenSize === 'Small' ||
              this.currentScreenSize === 'XSmall'
            ) {
              this.hideGreeting = true;
            } else {
              this.hideGreeting = false;
            }
          }
        }
        this._cdr.markForCheck();
      });
  }

  logOut(): void {
    this._store.dispatch(new Logout());
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
