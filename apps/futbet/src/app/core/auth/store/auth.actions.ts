import { User } from '../user.model';

export class LoginWithEmailAndPassword {
  static type = '[Auth] LoginWithEmailAndPassword';
  constructor(public email: string, public password: string) {}
}

export class CreateUserWithEmailAndPassword {
  static type = '[Auth] CreateUserWithEmailAndPassword';
  constructor(
    public email: string,
    public password: string,
    public displayName: string
  ) {}
}

export class LoginWithGoogle {
  static readonly type = '[Auth] LoginWithGoogle';
}

export class GetAuthState {
  static readonly type = '[Auth] GetAuthState';
}

export class Logout {
  static type = '[Auth] Logout';
}

export class PasswordReset {
  static type = '[Auth] PasswordReset';
  constructor(public email: string) {}
}

export class ConfirmPasswordReset {
  static type = '[Auth] ConfirmPasswordReset';
  constructor(public password: string, public code: string) {}
}

export class CreateUserInStore {
  static type = '[Auth] CreateUserInStore';
  constructor(public payload: Partial<User>) {}
}
