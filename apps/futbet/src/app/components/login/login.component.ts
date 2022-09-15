import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Actions, ofActionCompleted, Store } from '@ngxs/store';
import firebase from 'firebase/compat/app';
import { Subject, takeUntil } from 'rxjs';

import {
  FirebaseAuthService,
  LoginWithEmailAndPassword,
  LoginWithGoogle,
} from '../../core';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'futbet-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RegisterComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private _fb = inject(FormBuilder);
  private _store = inject(Store);
  private _toast = inject(HotToastService);
  private _actions$ = inject(Actions);
  private _fAuthS = inject(FirebaseAuthService);

  loginForm!: FormGroup;
  destroyed = new Subject<void>();

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.subscribeToActions();
  }

  subscribeToActions(): void {
    this._actions$
      .pipe(
        ofActionCompleted(LoginWithEmailAndPassword, LoginWithGoogle),
        takeUntil(this.destroyed)
      )
      .subscribe(result => {
        const { error } = result.result;
        if (error) {
          const handledError = this._fAuthS.handleError(
            error as firebase.auth.Error
          );
          this._toast.error(handledError);
        }
      });
  }

  loginWithGoogle(): void {
    this._store.dispatch(new LoginWithGoogle());
  }

  loginWithEmailAndPassword(): void {
    const { email, password } = this.loginForm.value;
    this._store.dispatch(new LoginWithEmailAndPassword(email, password));
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
