import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { errorMap } from '../../error.map';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  constructor(private afAuth: AngularFireAuth) {}

  authState() {
    return this.afAuth.authState;
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signInWithPopup(provider: firebase.auth.AuthProvider) {
    return this.afAuth.signInWithPopup(provider);
  }

  createUserWithEmailAndPassword(
    email: string,
    password: string,
    displayName: string
  ) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user) {
          result.user.updateProfile({ displayName });
        }
      });
  }

  signOut() {
    return this.afAuth.signOut();
  }

  handleError(error: firebase.auth.Error): string {
    const message = errorMap.has(error.code)
      ? (errorMap.get(error.code) as string)
      : error.message;

    return message;
  }
}
