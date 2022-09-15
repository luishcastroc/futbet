import { inject, Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class ResultsService {
  private _fb = inject(FormBuilder);

  generateResultsForm(): FormGroup {
    const resultsForm = this._fb.group({
      userId: ['', Validators.required],
      generationDate: [DateTime.now().toLocal().toJSDate()],
      results: this._fb.array([]),
      updateDate: [DateTime.now().toLocal().toJSDate()],
    });

    return resultsForm;
  }

  getResultsGroup(): FormGroup {
    return this._fb.group({
      id: [null, Validators.required],
      homeTeamId: [null, Validators.required],
      awayTeamId: [null, Validators.required],
      homeScore: [null, Validators.required],
      awayScore: [null, Validators.required],
      goldenBall: [false],
    });
  }
}
