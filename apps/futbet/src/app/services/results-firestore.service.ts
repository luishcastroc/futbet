import { Injectable } from '@angular/core';
import { NgxsFirestore } from '@ngxs-labs/firestore-plugin';

import { Results } from '../core/result.model';

@Injectable({
  providedIn: 'root',
})
export class ResultsFirestoreService extends NgxsFirestore<Results> {
  protected path = 'results';
}
