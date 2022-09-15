import { inject, Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';

import { AuthState } from '../store/auth.state';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private _store = inject(Store);
  isLoggedIn$: Observable<boolean> = this._store.select(AuthState.loggedIn);

  canActivate() {
    return this.isLoggedIn$.pipe(
      map(loggedIn => {
        if (loggedIn) {
          return true;
        } else {
          this._store.dispatch(new Navigate(['/sign-in']));
          return false;
        }
      })
    );
  }

  canActivateChild():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.isLoggedIn$.pipe(
      map(loggedIn => {
        if (loggedIn) {
          return true;
        } else {
          this._store.dispatch(new Navigate(['/sign-in']));
          return false;
        }
      })
    );
  }
}
