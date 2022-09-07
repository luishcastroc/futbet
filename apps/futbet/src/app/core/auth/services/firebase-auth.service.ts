import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';

import { errorMap } from '../../error.map';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  handleError(error: firebase.auth.Error): string {
    const message = errorMap.has(error.code)
      ? (errorMap.get(error.code) as string)
      : error.message;

    return message;
  }
}
