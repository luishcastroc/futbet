import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HotToastService } from '@ngneat/hot-toast';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Store } from '@ngxs/store';
import { Subject, takeUntil, tap } from 'rxjs';
import { ConfirmPasswordReset } from '../../core';

import { createPasswordStrengthValidator } from '../register/password-stregth.validator';

@Component({
  selector: 'futbet-confirm-password-reset',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './confirm-password-reset.component.html',
  styleUrls: ['./confirm-password-reset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmPasswordResetComponent implements OnInit, OnDestroy {
  private _store = inject(Store);
  private _actions = inject(Actions);
  private _toast = inject(HotToastService);
  private _unsubscribeAll: Subject<unknown> = new Subject<unknown>();
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    createPasswordStrengthValidator(),
  ]);
  loading = false;

  @Input() code!: string;

  ngOnInit(): void {
    this._actions
      .pipe(
        ofActionCompleted(ConfirmPasswordReset),
        takeUntil(this._unsubscribeAll),
        tap(result => {
          this.loading = false;
          const { error, successful } = result.result;
          let message;

          if (error) {
            this._toast.error(error.message, {
              duration: 4000,
              position: 'bottom-center',
            });
          }
          if (successful) {
            message = 'Contraseña restablecida correctamente.';
            this._toast.success(message, {
              duration: 4000,
              position: 'bottom-center',
            });
          }
        })
      )
      .subscribe();
  }

  confirm(): void {
    this.loading = true;
    this._store.dispatch(
      new ConfirmPasswordReset(this.password.value as string, this.code)
    );
  }

  back(): void {
    this._store.dispatch(new Navigate(['/sign-in']));
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
