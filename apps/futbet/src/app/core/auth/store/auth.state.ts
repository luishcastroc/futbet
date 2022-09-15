import 'firebase/auth';

import { inject, Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  Emitted,
  NgxsFirestoreConnect,
  StreamEmitted,
} from '@ngxs-labs/firestore-plugin';
import { Navigate } from '@ngxs/router-plugin';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import firebase from 'firebase/compat/app';
import { tap } from 'rxjs';

import { ClearResultsState } from '../../../store/results.actions';
import { UsersFirestoreService } from '../services/firebase-users.service';
import {
  CreateUserInStore,
  CreateUserWithEmailAndPassword,
  GetAuthState,
  LoginWithEmailAndPassword,
  LoginWithGoogle,
  Logout,
} from './auth.actions';
import { AuthStateModel } from './auth.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
  private afAuth = inject(AngularFireAuth);
  private ngxsFirestoreConnect = inject(NgxsFirestoreConnect);
  private usersFs = inject(UsersFirestoreService);
  private afs = inject(AngularFirestore);

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
      .then(async ({ user }) => {
        if (user) {
          ctx.patchState({
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
            uid: user.uid,
          });

          const userQry = await this.afs.firestore
            .collection('users')
            .where('uid', '==', user.uid)
            .get();

          const storeUser = userQry.docs[0]
            ? userQry.docs[0].data()
            : undefined;

          if (!storeUser) {
            const { displayName, uid, email } = user;
            if (displayName && uid && email) {
              ctx.dispatch(new CreateUserInStore({ uid, email, displayName }));
            } else {
              throw new Error(
                'Error creando usuario en la base de datos, verificar'
              );
            }
          }

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
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
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
          const uid = user.uid;
          await await user.updateProfile({ displayName }).then(() => {
            ctx.patchState({
              displayName,
            });
            ctx.dispatch(new CreateUserInStore({ uid, email, displayName }));
          });
        }
      });
  }

  @Action(CreateUserInStore)
  create(ctx: StateContext<AuthStateModel>, { payload }: CreateUserInStore) {
    return this.usersFs.create$(payload).pipe(
      tap(() => {
        ctx.dispatch(new Navigate(['/dashboard']));
      })
    );
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
      ctx.dispatch([new Navigate(['/sign-in']), new ClearResultsState()]);
    });
  }
}
