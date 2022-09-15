import { inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';

import { AuthState } from '../store/auth.state';

@Injectable({
  providedIn: 'root',
})
export class noAuthGuard implements CanActivate {
  private _store = inject(Store);
  isLoggedIn$: Observable<boolean> = this._store.select(AuthState.loggedIn);

  canActivate() {
    return this.isLoggedIn$.pipe(
      map(loggedIn => {
        if (loggedIn) {
          this._store.dispatch(new Navigate(['/dashboard']));
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
