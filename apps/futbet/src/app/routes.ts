import { Route } from '@angular/router';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { noAuthGuard } from './core/auth/guards/noAuth.guard';

export const routes: Route[] = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  {
    path: 'sign-in',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./components/login/login.component').then(
        com => com.LoginComponent
      ),
  },
  {
    path: 'register-user',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./components/register/register.component').then(
        com => com.RegisterComponent
      ),
  },
  {
    path: 'forgot-password',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./components/forgot-password/forgot-password.component').then(
        com => com.ForgotPasswordComponent
      ),
  },
  {
    path: 'verify',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./components/confirm/confirm.component').then(
        com => com.ConfirmComponent
      ),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/dashboard/dashboard.routes').then(
        chl => chl.dashboardRoutes
      ),
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(
        com => com.NotFoundComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/not-found',
  },
];
