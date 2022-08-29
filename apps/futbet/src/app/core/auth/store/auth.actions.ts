export class LoginWithEmailAndPassword {
  static type = '[Auth] LoginWithEmailAndPassword';
  constructor(public email: string, public password: string) {}
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
