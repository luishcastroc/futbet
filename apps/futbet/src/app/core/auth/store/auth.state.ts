import 'firebase/auth';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  Emitted,
  NgxsFirestoreConnect,
  StreamEmitted,
} from '@ngxs-labs/firestore-plugin';
import { Navigate } from '@ngxs/router-plugin';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import firebase from 'firebase/compat/app';

import {
  CreateUserWithEmailAndPassword,
  GetAuthState,
  LoginWithEmailAndPassword,
  LoginWithGoogle,
  Logout,
} from './auth.actions';
import { AuthStateModel } from './auth.model';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    displayName: '',
    photoURL: '',
    email: '',
    uid: '',
  },
})
@Injectable()
export class AuthState implements NgxsOnInit {
  @Selector() static loggedIn(state: AuthStateModel) {
    return !!state.email;
  }

  @Selector() static loggedOut(state: AuthStateModel) {
    return !state.email;
  }

  @Selector() static user(state: AuthStateModel) {
    return state;
  }

  @Selector() static uid(state: AuthStateModel) {
    return state.uid;
  }

  @Selector() static displayName(state: AuthStateModel) {
    return state.displayName;
  }

  @Selector() static email(state: AuthStateModel) {
    return state.email;
  }

  @Selector() static photoURL(state: AuthStateModel) {
    return state.photoURL;
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
    if (payload) {
      ctx.patchState({
        displayName: payload.displayName,
        photoURL: payload.photoURL,
        email: payload.email,
        uid: payload.uid,
      });
    } else {
      ctx.setState({
        displayName: '',
        photoURL: '',
        email: '',
        uid: '',
      });
    }
  }

  @Action(LoginWithGoogle)
  async loginWithGoogle(ctx: StateContext<AuthStateModel>) {
    await this.afAuth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(({ user }) => {
        if (user) {
          ctx.patchState({
            displayName: user.displayName as string,
            photoURL: user.photoURL as string,
            email: user.email as string,
            uid: user.uid,
          });
          ctx.dispatch(new Navigate(['/dashboard']));
        }
      });
  }

  @Action(LoginWithEmailAndPassword)
  async loginWithEmailAndPassword(
    ctx: StateContext<AuthStateModel>,
    { email, password }: LoginWithEmailAndPassword
  ) {
    await this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(({ user }) => {
        if (user) {
          ctx.patchState({
            displayName: user.displayName as string,
            photoURL: user.photoURL as string,
            email: user.email as string,
            uid: user.uid,
          });
          ctx.dispatch(new Navigate(['/dashboard']));
        }
      });
  }

  @Action(CreateUserWithEmailAndPassword)
  async createUserWithEmailAndPassword(
    ctx: StateContext<AuthStateModel>,
    { email, password, displayName }: CreateUserWithEmailAndPassword
  ) {
    await this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then(async ({ user }) => {
        if (user) {
          await user.updateProfile({ displayName }).then(() => {
            ctx.patchState({
              displayName,
            });
            ctx.dispatch(new Navigate(['/dashboard']));
          });
        }
      });
  }

  @Action(Logout)
  async logout(ctx: StateContext<AuthStateModel>) {
    await this.afAuth.signOut().then(() => {
      ctx.setState({
        displayName: '',
        photoURL: '',
        email: '',
        uid: '',
      });
      ctx.dispatch(new Navigate(['/sign-in']));
    });
  }
}
