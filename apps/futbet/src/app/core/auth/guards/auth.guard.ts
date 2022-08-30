import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';

import { AuthState } from '../store/auth.state';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  isLoggedIn$!: Observable<boolean>;
  constructor(private _store: Store) {
    this.isLoggedIn$ = this._store.select(AuthState.loggedIn);
  }

  canActivate() {
    return this.isLoggedIn$.pipe(
      map((loggedIn) => {
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
