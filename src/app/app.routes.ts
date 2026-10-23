import { Routes } from '@angular/router';
import { authPermissionGuard } from './core/auth/auth.guard';
export const routes: Routes = [
  { path: '', title: 'Overview', loadComponent: () => import('./features/home/home.page').then(m => m.HomePage) },
  { path: 'login', title: 'Sign in', loadComponent: () => import('./features/auth/login.page').then(m => m.LoginPage) },
  { path: 'customers', title: 'Customers', canActivate: [authPermissionGuard],
    data: { permission: 'customers:read' },
    loadComponent: () => import('./features/customers/customers.page').then(m => m.CustomersPage) },
  // FEATURE_ROUTE_ANCHOR
  { path: '401', title: 'Authentication required', loadComponent: () => import('./features/errors/error.page').then(m => m.ErrorPage), data: { status: '401' } },
  { path: '403', title: 'Access denied', loadComponent: () => import('./features/errors/error.page').then(m => m.ErrorPage), data: { status: '403' } },
  { path: '500', title: 'Server error', loadComponent: () => import('./features/errors/error.page').then(m => m.ErrorPage), data: { status: '500' } },
  { path: 'maintenance', title: 'Maintenance', loadComponent: () => import('./features/errors/error.page').then(m => m.ErrorPage), data: { status: 'maintenance' } },
  { path: '**', title: 'Not found', loadComponent: () => import('./features/errors/not-found.page').then(m => m.NotFoundPage) },
];
