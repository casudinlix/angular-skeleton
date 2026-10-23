import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PUBLIC_APP_CONFIG } from '../config/app-config';
import { ApiRequestError, isRecord } from '../http/api.types';

export interface Identity {
  readonly id: string;
  readonly displayName: string;
  readonly permissions: readonly string[];
}
export type SessionState =
  | { readonly status: 'unknown' | 'unavailable' | 'anonymous' }
  | { readonly status: 'authenticated'; readonly identity: Identity };

export function parseIdentity(value: unknown): Identity {
  if (!isRecord(value) || typeof value['id'] !== 'string' ||
      typeof value['displayName'] !== 'string' || !Array.isArray(value['permissions']) ||
      !value['permissions'].every((permission: unknown) => typeof permission === 'string')) {
    throw new Error('Invalid session response');
  }
  return {
    id: value['id'],
    displayName: value['displayName'],
    permissions: value['permissions'] as string[],
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly prefix = inject(PUBLIC_APP_CONFIG).apiPrefix;
  private readonly current = signal<SessionState>({ status: 'unknown' });
  private restoreInFlight: Promise<SessionState> | null = null;
  // Reject stale session responses after login/logout/401.
  private revision = 0;

  readonly state = this.current.asReadonly();

  get identity(): Identity | null {
    const value = this.current();
    return value.status === 'authenticated' ? value.identity : null;
  }

  has(permission: string): boolean {
    return this.identity?.permissions.includes(permission) ?? false;
  }

  async restore(force = false): Promise<SessionState> {
    if (this.restoreInFlight) return this.restoreInFlight;
    const status = this.current().status;
    if (!force && status !== 'unknown' && status !== 'unavailable') return this.current();

    const revision = ++this.revision;
    const task: Promise<SessionState> = (async () => {
      try {
        const payload = await firstValueFrom(this.http.get<unknown>(`${this.prefix}/session`));
        const identity = parseIdentity(payload);
        if (revision === this.revision) {
          this.current.set({ status: 'authenticated', identity });
        }
      } catch (error: unknown) {
        if (revision === this.revision) {
          this.current.set({
            status: error instanceof ApiRequestError && error.status === 401
              ? 'anonymous' : 'unavailable',
          });
        }
      }
      return this.current();
    })();

    this.restoreInFlight = task;
    try {
      return await task;
    } finally {
      if (this.restoreInFlight === task) this.restoreInFlight = null;
    }
  }

  retry(): Promise<SessionState> {
    return this.restore(true);
  }

  async signIn(email: string, password: string): Promise<void> {
    const revision = ++this.revision;
    const payload = await firstValueFrom(
      this.http.post<unknown>(`${this.prefix}/session`, { email, password }),
    );
    const identity = parseIdentity(payload);
    if (revision === this.revision) {
      this.current.set({ status: 'authenticated', identity });
    }
  }

  async signOut(): Promise<void> {
    const revision = ++this.revision;
    // A failed server logout must not be represented as success.
    await firstValueFrom(this.http.delete<void>(`${this.prefix}/session`));
    if (revision === this.revision) this.current.set({ status: 'anonymous' });
  }

  invalidate(): void {
    ++this.revision;
    this.current.set({ status: 'anonymous' });
  }
}
