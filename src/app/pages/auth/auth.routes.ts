import { Routes } from '@angular/router';
import { translationResolver } from '../../core/i18n/translation.resolver';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
    resolve: { translations: translationResolver('auth') },
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then((m) => m.RegisterComponent),
    resolve: { translations: translationResolver('auth') },
  },
];
