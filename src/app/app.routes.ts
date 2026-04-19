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
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/authenticated-layout/authenticated-layout.component').then(
        (m) => m.AuthenticatedLayoutComponent,
      ),
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
        resolve: { translations: translationResolver('dashboard') },
      },
      {
        path: 'users',
        loadChildren: () => import('./pages/users/users.routes').then((m) => m.USERS_ROUTES),
        resolve: { translations: translationResolver('profile') },
      },
      {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin.component').then((m) => m.AdminComponent),
      },
      {
        path: 'wallets',
        loadComponent: () =>
          import('./pages/wallets/wallets.component').then((m) => m.WalletsComponent),
        resolve: { translations: translationResolver('wallets') },
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/categories/categories.component').then((m) => m.CategoriesComponent),
        resolve: { translations: translationResolver('categories') },
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./pages/transactions/transactions.component').then(
            (m) => m.TransactionsComponent,
          ),
        resolve: { translations: translationResolver('transactions') },
      },
      {
        path: 'payment',
        loadComponent: () =>
          import('./pages/payment/payment.component').then((m) => m.PaymentComponent),
        resolve: { translations: translationResolver('payment') },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
