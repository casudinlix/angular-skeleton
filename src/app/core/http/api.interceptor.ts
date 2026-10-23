import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ApiRequestError, isRecord } from './api.types';

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  const document = inject(DOCUMENT);
  const auth = inject(AuthService);
  const router = inject(Router);
  const origin = document.location?.origin ?? 'http://localhost';
  const url = new URL(request.url, origin);

  // Never attach credentials or leak internal errors to external origins.
  if (url.origin !== origin || !url.pathname.startsWith('/api/')) return next(request);

  return next(request.clone({ withCredentials: true })).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) return throwError(() => error);

      // Global session invalidation; individual features can now react to auth.state().
      // Do not invalidate on permission-denied 403: the session may still be valid.
      if (error.status === 401) {
        const isSessionProbe = url.pathname === '/api/session' &&
          (request.method === 'GET' || request.method === 'POST');
        // A stale session probe must never log out a newer successful sign-in.
        // The AuthService.restore() caller handles its own 401 with revision checking.
        if (!isSessionProbe) auth.invalidate();
        if (url.pathname !== '/api/session' && !router.url.startsWith('/login')) {
          void router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
        }
      }

      const payload: unknown = error.error;
      const code = isRecord(payload) && typeof payload['code'] === 'string'
        ? payload['code'] : error.status === 0 ? 'NETWORK_ERROR' : 'HTTP_ERROR';
      const message = error.status === 0 ? 'Unable to connect to the API'
        : error.status >= 500 ? 'Server error'
        : error.status === 401 ? 'Authentication required'
        : error.status === 403 ? 'Access denied'
        : error.status === 429 ? 'Too many requests'
        : 'Request failed';
      return throwError(() => new ApiRequestError(error.status, code, message));
    }),
  );
};
