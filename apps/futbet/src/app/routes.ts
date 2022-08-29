import { Route } from '@angular/router';

export const routes: Route[] = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  {
    path: 'sign-in',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (com) => com.LoginComponent
      ),
  },
  {
    path: 'register-user',
    loadComponent: () =>
      import('./components/register/register.component').then(
        (com) => com.RegisterComponent
      ),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./components/forgot-password/forgot-password.component').then(
        (com) => com.ForgotPasswordComponent
      ),
  },
  {
    path: 'verify-email',
    loadComponent: () =>
      import('./components/verify-email/verify-email.component').then(
        (com) => com.VerifyEmailComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (com) => com.DashboardComponent
      ),
  },
];
