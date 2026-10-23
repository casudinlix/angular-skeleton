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

function parseIdentity(value: unknown): Identity {
  if (!isRecord(value) || typeof value['id'] !== 'string' ||
      typeof value['displayName'] !== 'string' || !Array.isArray(value['permissions']) ||
      !value['permissions'].every((p: unknown) => typeof p === 'string')) {
    throw new Error('Invalid session response');
  }
  return { id: value['id'], displayName: value['displayName'], permissions: value['permissions'] as string[] };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly prefix = inject(PUBLIC_APP_CONFIG).apiPrefix;
  private readonly current = signal<SessionState>({ status: 'unknown' });
  private loading: Promise<SessionState> | null = null;
  readonly state = this.current.asReadonly();

  get identity(): Identity | null {
    const value = this.current();
    return value.status === 'authenticated' ? value.identity : null;
  }

  has(permission: string): boolean { return this.identity?.permissions.includes(permission) ?? false; }

  async restore(): Promise<SessionState> {
    if (this.current().status !== 'unknown') return this.current();
    if (this.loading) return this.loading;
    this.loading = (async () => {
      try {
        const response = await firstValueFrom(this.http.get<unknown>(`${this.prefix}/session`));
        this.current.set({ status: 'authenticated', identity: parseIdentity(response) });
      } catch (error: unknown) {
        this.current.set({ status: error instanceof ApiRequestError && error.status === 401
          ? 'anonymous' : 'unavailable' });
      }
      return this.current();
    })();
    try { return await this.loading; } finally { this.loading = null; }
  }

  async signIn(email: string, password: string): Promise<void> {
    const response = await firstValueFrom(this.http.post<unknown>(`${this.prefix}/session`, { email, password }));
    this.current.set({ status: 'authenticated', identity: parseIdentity(response) });
  }

  async signOut(): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.prefix}/session`));
    this.current.set({ status: 'anonymous' });
  }
  invalidate(): void { this.current.set({ status: 'anonymous' }); }
}
