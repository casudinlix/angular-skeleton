import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const session = await auth.restore();
  if (session.status === 'unavailable') return router.parseUrl('/500');
  if (session.status !== 'authenticated') {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }
  return true;
};
export const permissionGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const permission: unknown = route.data['permission'];
  return typeof permission !== 'string' || auth.has(permission)
    ? true : inject(Router).parseUrl('/403');
};
