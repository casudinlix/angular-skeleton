import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Resolve backend session before permission checks. Do not assume multiple
 * Angular route guards with asynchronous work execute sequentially.
 */
export const authPermissionGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const session = await auth.restore();

  if (session.status === 'unavailable') return router.parseUrl('/500');
  if (session.status !== 'authenticated') {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }

  const permission: unknown = route.data['permission'];
  return typeof permission !== 'string' || auth.has(permission)
    ? true : router.parseUrl('/403');
};
