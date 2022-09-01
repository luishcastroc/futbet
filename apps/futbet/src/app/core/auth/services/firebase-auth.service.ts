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
