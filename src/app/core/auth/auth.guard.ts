import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Validate server session first, then UI permissions; server always remains authoritative. */
export const authPermissionGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const session = await auth.restore();

  if (session.status === 'unavailable') {
    return router.createUrlTree(['/500'], { queryParams: { returnUrl: state.url } });
  }
  if (session.status !== 'authenticated') {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }
  const permission: unknown = route.data['permission'];
  return typeof permission !== 'string' || auth.has(permission)
    ? true : router.parseUrl('/403');
};
