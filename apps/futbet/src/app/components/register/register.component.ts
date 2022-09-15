import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';

import { CreateUserWithEmailAndPassword } from '../../core/auth/store/auth.actions';
import { createPasswordStrengthValidator } from './password-stregth.validator';

@Component({
  selector: 'futbet-register',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  private _store = inject(Store);
  private _fb = inject(FormBuilder);
  registerForm!: UntypedFormGroup;

  get displayName() {
    return this.registerForm.controls['displayName'];
  }

  get email() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  ngOnInit(): void {
    this.registerForm = this._fb.group({
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          createPasswordStrengthValidator(),
        ],
      ],
    });
  }

  cancel(): void {
    this._store.dispatch(new Navigate(['/sign-in']));
  }

  saveAccount(): void {
    const { email, password, displayName } = this.registerForm.value;
    this._store.dispatch(
      new CreateUserWithEmailAndPassword(email, password, displayName)
    );
  }
}
