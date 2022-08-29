import 'firebase/auth';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  Emitted,
  NgxsFirestoreConnect,
  StreamEmitted,
} from '@ngxs-labs/firestore-plugin';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import firebase from 'firebase/compat/app';

import { User } from '../user.model';
import { GetAuthState, LoginWithGoogle, Logout } from './auth.actions';
import { AuthStateModel } from './auth.model';
import { Injectable } from '@angular/core';
import { defer, tap } from 'rxjs';
import { Navigate } from '@ngxs/router-plugin';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
  },
})
@Injectable()
export class AuthState implements NgxsOnInit {
  @Selector() static loggedIn(state: AuthStateModel) {
    return !!state.user?.email;
  }

  @Selector() static loggedOut(state: AuthStateModel) {
    return !state.user?.email;
  }

  @Selector() static user(state: AuthStateModel) {
    return state;
  }

  @Selector() static uid(state: AuthStateModel) {
    return state.user?.uid;
  }

  @Selector() static displayName(state: AuthStateModel) {
    return state.user?.displayName;
  }

  @Selector() static email(state: AuthStateModel) {
    return state.user?.email;
  }

  @Selector() static photoURL(state: AuthStateModel) {
    return state.user?.photoURL;
  }

  constructor(
    private afAuth: AngularFireAuth,
    private ngxsFirestoreConnect: NgxsFirestoreConnect
  ) {}

  ngxsOnInit(ctx: StateContext<AuthStateModel>) {
    this.ngxsFirestoreConnect.connect(GetAuthState, {
      to: () => this.afAuth.authState,
    });

    ctx.dispatch(new GetAuthState());
  }

  @Action(StreamEmitted(GetAuthState))
  getAuthState(
    ctx: StateContext<AuthStateModel>,
    { payload }: Emitted<GetAuthState, AuthStateModel>
  ) {
    if (payload && payload.user) {
      const user: User = {
        displayName: payload.user.displayName,
        photoURL: payload.user.photoURL,
        email: payload.user.email,
        uid: payload.user.uid,
        emailVerified: payload.user.emailVerified,
      };
      ctx.patchState({
        user,
      });
    } else {
      ctx.patchState({
        user: null,
      });
    }
  }

  @Action(LoginWithGoogle)
  loginWithGoogle(ctx: StateContext<AuthStateModel>) {
    return defer(() =>
      this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    ).pipe(
      tap(({ user }) => {
        if (user) {
          ctx.dispatch(new Navigate(['/dashboard']));
        }
      })
    );
  }

  @Action(Logout)
  logout() {
    return this.afAuth.signOut();
  }
}
