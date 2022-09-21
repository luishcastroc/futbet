import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HotToastService } from '@ngneat/hot-toast';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, Store } from '@ngxs/store';
import { Subject, takeUntil, tap } from 'rxjs';
import { PasswordReset } from '../../core';

@Component({
  selector: 'futbet-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  private _store = inject(Store);
  private _actions = inject(Actions);
  private _toast = inject(HotToastService);
  private _unsubscribeAll: Subject<unknown> = new Subject<unknown>();
  email = new FormControl('', [Validators.required, Validators.email]);

  ngOnInit(): void {
    this._actions
      .pipe(
        ofActionCompleted(PasswordReset),
        takeUntil(this._unsubscribeAll),
        tap(result => {
          const { error, successful } = result.result;
          let message;

          if (error) {
            this._toast.error(error.message, {
              duration: 4000,
              position: 'bottom-center',
            });
          }
          if (successful) {
            message =
              'Correo enviado, checa tu bandeja y sigue los pasos para restablecer tu contraseña.';
            this._toast.success(message, {
              duration: 4000,
              position: 'bottom-center',
            });
          }
        })
      )
      .subscribe();
  }

  back() {
    this._store.dispatch(new Navigate(['/sign-in']));
  }

  passwordReset() {
    if (this.email.value) {
      this._store.dispatch(new PasswordReset(this.email.value));
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
