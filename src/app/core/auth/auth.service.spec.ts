import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AuthService } from './auth.service';
import { apiInterceptor } from '../http/api.interceptor';

describe('AuthService session lifecycle', () => {
  let auth: AuthService;
  let requests: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([apiInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    auth = TestBed.inject(AuthService);
    requests = TestBed.inject(HttpTestingController);
  });

  afterEach(() => requests.verify());

  it('handles 401 on session restore as anonymous', async () => {
    const pending = auth.restore();
    requests.expectOne('/api/session').flush(
      { code: 'UNAUTHORIZED' }, { status: 401, statusText: 'Unauthorized' },
    );
    expect((await pending).status).toBe('anonymous');
  });

  it('can retry an unavailable backend and restore the identity', async () => {
    const first = auth.restore();
    requests.expectOne('/api/session').flush(
      { code: 'SERVICE_UNAVAILABLE' }, { status: 503, statusText: 'Unavailable' },
    );
    expect((await first).status).toBe('unavailable');

    const retry = auth.retry();
    requests.expectOne('/api/session').flush({
      id: 'account-1',
      displayName: 'Example',
      permissions: ['customers:read'],
    });
    expect((await retry).status).toBe('authenticated');
  });

  it('does not erase a newer sign-in when an older session probe gets 401', async () => {
    const stale = auth.restore();
    const probe = requests.expectOne('/api/session');

    const signIn = auth.signIn('a@example.test', 'secret');
    requests.expectOne('/api/session').flush({
      id: 'fresh',
      displayName: 'New Session',
      permissions: ['customers:read'],
    });
    await signIn;
    probe.flush({ code: 'UNAUTHORIZED' }, { status: 401, statusText: 'Unauthorized' });
    await stale;
    expect(auth.identity?.id).toBe('fresh');
  });

  it('rejects a stale restore response after local session invalidation', async () => {
    const pending = auth.restore();
    const request = requests.expectOne('/api/session');
    auth.invalidate();
    request.flush({
      id: 'obsolete',
      displayName: 'Stale',
      permissions: ['customers:read'],
    });
    expect((await pending).status).toBe('anonymous');
    expect(auth.identity).toBeNull();
  });
});
