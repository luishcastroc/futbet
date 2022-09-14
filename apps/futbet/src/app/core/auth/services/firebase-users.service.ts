import { Injectable } from '@angular/core';
import { NgxsFirestore } from '@ngxs-labs/firestore-plugin';
import { User } from '../user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersFirestoreService extends NgxsFirestore<Partial<User>> {
  protected path = 'users';
}
