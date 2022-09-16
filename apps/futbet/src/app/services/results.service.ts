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
      matchDay: [Validators.required],
      goldenBall: [false],
    });
  }

  checkGoldenBall(results: FormArray): string | undefined {
    let message;
    const golden = [];
    for (const i in results.controls) {
      if (results.at(Number(i)).get('goldenBall')?.value) {
        golden.push(results.at(Number(i)).get('matchDay')?.value);
      }
    }
    switch (true) {
      case golden.length === 0:
        message =
          'No has agregado ningún balón de oro estas seguro? (recuerda que valen doble)';
        break;
      case golden.length > 0 && golden.length < 12: {
        const dias = String(golden);
        message = `Solo has agregado balón de oro para ${
          golden.length === 1 ? `el dia ${dias}` : `los dias ${dias}`
        } estas seguro? (recuerda que valen doble)`;
        break;
      }
    }
    return message;
  }
}
