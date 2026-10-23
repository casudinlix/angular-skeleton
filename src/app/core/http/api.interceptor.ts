import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiRequestError, isRecord } from './api.types';

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  const document = inject(DOCUMENT);
  const origin = document.location?.origin || 'http://localhost';
  const url = new URL(request.url, origin);
  if (url.origin !== origin || !url.pathname.startsWith('/api/')) return next(request);
  // Credentials only go to our same-origin API. Angular's XSRF interceptor
  // supplies X-XSRF-TOKEN on mutations when the XSRF-TOKEN cookie is present.
  return next(request.clone({ withCredentials: true })).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) return throwError(() => error);
      const body: unknown = error.error;
      const code = isRecord(body) && typeof body['code'] === 'string'
        ? body['code'] : error.status === 0 ? 'NETWORK_ERROR' : 'HTTP_ERROR';
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
