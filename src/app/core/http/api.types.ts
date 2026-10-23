export interface CursorPage<T> { readonly items: readonly T[]; readonly nextCursor: string | null; }
export interface CursorQuery { readonly cursor?: string; readonly limit: number; readonly search?: string; }
export class ApiRequestError extends Error {
  constructor(readonly status: number, readonly code: string, message: string) {
    super(message);
    this.name = 'ApiRequestError';
  }
}
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
