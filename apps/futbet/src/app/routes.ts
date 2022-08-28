import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/login/login.component').then(
        (com) => com.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./modules/auth/register/register.component').then(
        (com) => com.RegisterComponent
      ),
  },
  // ...
];
