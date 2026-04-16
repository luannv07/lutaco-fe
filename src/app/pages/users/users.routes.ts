import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: 'me',
    loadComponent: () => import('./me/me.component').then((m) => m.MeComponent),
  },
];

