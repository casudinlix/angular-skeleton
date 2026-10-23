import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PUBLIC_APP_CONFIG } from '../../core/config/app-config';
import { CursorPage, CursorQuery, isRecord } from '../../core/http/api.types';
import { Customer, CustomerInput } from './customer.types';

export function parseCustomer(value: unknown): Customer {
  if (!isRecord(value) || typeof value['id'] !== 'string' ||
      typeof value['name'] !== 'string' || typeof value['email'] !== 'string' ||
      (value['status'] !== 'active' && value['status'] !== 'inactive')) {
    throw new Error('Invalid customer API response');
  }
  return { id: value['id'], name: value['name'], email: value['email'], status: value['status'] };
}
export function parseCustomerPage(value: unknown): CursorPage<Customer> {
  if (!isRecord(value) || !Array.isArray(value['items']) ||
      (value['nextCursor'] !== null && typeof value['nextCursor'] !== 'string')) {
    throw new Error('Invalid cursor page response');
  }
  return { items: value['items'].map(parseCustomer), nextCursor: value['nextCursor'] };
}

@Injectable({ providedIn: 'root' })
export class CustomerApi {
  private readonly http = inject(HttpClient);
  private readonly prefix = inject(PUBLIC_APP_CONFIG).apiPrefix;
  private readonly resource = `${this.prefix}/customers`;
  list(query: CursorQuery): Observable<CursorPage<Customer>> {
    let params = new HttpParams().set('limit', Math.min(Math.max(query.limit, 1), 100));
    if (query.cursor) params = params.set('cursor', query.cursor);
    if (query.search) params = params.set('search', query.search);
    return this.http.get<unknown>(this.resource, { params }).pipe(map(parseCustomerPage));
  }
  get(id: string): Observable<Customer> {
    return this.http.get<unknown>(`${this.resource}/${encodeURIComponent(id)}`).pipe(map(parseCustomer));
  }
  create(input: CustomerInput): Observable<Customer> {
    return this.http.post<unknown>(this.resource, input).pipe(map(parseCustomer));
  }
  update(id: string, input: CustomerInput): Observable<Customer> {
    return this.http.patch<unknown>(`${this.resource}/${encodeURIComponent(id)}`, input).pipe(map(parseCustomer));
  }
  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.resource}/${encodeURIComponent(id)}`);
  }
}
