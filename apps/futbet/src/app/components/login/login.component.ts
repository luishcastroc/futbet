import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { Actions, Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';

import {
  LoginWithEmailAndPassword,
  LoginWithGoogle,
} from '../../core/auth/store/auth.actions';
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
  loginForm!: FormGroup;
  destroyed = new Subject<void>();

  constructor(
    private _fb: FormBuilder,
    private _store: Store,
    private _toast: HotToastService,
    private _actions$: Actions
  ) {}

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this._actions$.pipe(takeUntil(this.destroyed)).subscribe();
  }

  loginWithGoogle(): void {
    this._store.dispatch(new LoginWithGoogle());
  }

  loginWithEmailAndPassword(): void {
    const { email, password } = this.loginForm.value;
    console.log('email: ', email);
    console.log('password: ', password);
    this._store.dispatch(new LoginWithEmailAndPassword(email, password));
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
