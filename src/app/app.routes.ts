import { Routes } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { AuthGuard } from './shared/guards/auth.guard';
import { LoginGuard } from './shared/guards/login.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [LoginGuard],
    canActivateChild: [LoginGuard],
    loadComponent: () => import('@layout/auth-layout/auth-layout.component'),
    loadChildren: () => import('./auth-child.routes'),
    title: _('login'),
  },
  {
    path: '',
    canMatch: [AuthGuard],
    data: {
      authGuardRedirect: '/auth/login',
    },
    loadComponent: () =>
      import('@layout/content-layout/content-layout.component'),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('@pages/dashboard/dashboard.component'),
        title: 'dashboard',
        data: {
          breadcrumbs: [{ label: _('dashboard') }],
        },
      },
      {
        path: 'users',
        loadComponent: () => import('@pages/users/users.component'),
        title: 'users',
        data: {
          breadcrumbs: [{ label: _('users') }],
        },
      },
      {
        path: 'contacts',
        loadComponent: () => import('@pages/contacts/contacts.component'),
        title: 'contacts',
        data: {
          breadcrumbs: [{ label: _('contacts') }],
        },
      },
      {
        path: 'packages',
        loadComponent: () => import('@pages/packages/packages.component'),
        title: _('packages'),
        data: {
          breadcrumbs: [{ label: _('packages') }],
        },
      },
      {
        path: 'subscriptions',
        loadComponent: () =>
          import('@pages/subscriptions/subscriptions.component'),
        title: _('subscriptions'),
        data: {
          breadcrumbs: [
            { label: _('packages'), url: '/packages' },
            { label: _('subscriptions') },
          ],
        },
      },
    ],
  },
  {
    path: '403',
    loadComponent: () => import('@pages/errors/403/403.component'),
  },
  {
    path: '**',
    loadComponent: () => import('@pages/errors/404/404.component'),
  },
];
