import { Route } from '@angular/router';

import { AuthGuard } from '../../core/auth/guards/auth.guard';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    pathMatch: 'prefix',
    loadComponent: () =>
      import('./dashboard.component').then(com => com.DashboardComponent),
    children: [
      {
        path: 'ranking',
        loadComponent: () =>
          import('../ranking/ranking.component').then(
            com => com.RankingComponent
          ),
      },
      {
        path: 'results',
        loadComponent: () =>
          import('../results/results.component').then(
            com => com.ResultsComponent
          ),
      },
      {
        path: 'my-results',
        loadComponent: () =>
          import('../results/results.component').then(
            com => com.ResultsComponent
          ),
      },
      {
        path: 'games',
        loadComponent: () =>
          import('../games/games.component').then(com => com.GamesComponent),
      },
    ],
  },
];
