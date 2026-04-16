import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { translationResolver } from './core/i18n/translation.resolver';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./pages/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    resolve: { translations: translationResolver('auth') },
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./pages/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
    resolve: { translations: translationResolver('dashboard') },
  },
  {
    path: 'users',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/users/users.routes').then((m) => m.USERS_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
