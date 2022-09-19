import { Injectable } from '@angular/core';
import { NgxsFirestore } from '@ngxs-labs/firestore-plugin';

import { Game } from '../core/result.model';

@Injectable({
  providedIn: 'root',
})
export class UsersFirestoreService extends NgxsFirestore<Game> {
  protected path = 'users';
}
