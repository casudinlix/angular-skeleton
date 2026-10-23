import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { CursorPage, ApiRequestError } from '../../core/http/api.types';
import { CustomerApi } from './customer.api';
import { Customer } from './customer.types';
import { CustomersPage } from './customers.page';

describe('CustomersPage cursor and request cancellation', () => {
  const record: Customer = {
    id: 'example-id', name: 'Example', email: 'example@example.test', status: 'active',
  };

  function create() {
    const streams: Subject<CursorPage<Customer>>[] = [];
    const api = {
      list: () => {
        const subject = new Subject<CursorPage<Customer>>();
        streams.push(subject);
        return subject.asObservable();
      },
    };
    TestBed.configureTestingModule({
      providers: [{ provide: CustomerApi, useValue: api }],
    });
    const page = TestBed.runInInjectionContext(() => new CustomersPage());
    return { page, streams };
  }

  it('unsubscribes from the previous request and commits cursor only on success', () => {
    const { page, streams } = create();
    expect(streams[0].observed).toBe(true);
    page.loadPage('next');
    expect(streams[0].observed).toBe(false);
    streams[1].next({ items: [record], nextCursor: 'third' });
    expect(page.items()).toEqual([record]);
    expect(page.cursor()).toBe('third');
  });

  it('preserves back-stack until next-page response succeeds', () => {
    const { page, streams } = create();
    streams[0].next({ items: [record], nextCursor: 'second' });
    page.next();
    expect(page.history()).toEqual([]);
    streams[1].next({ items: [record], nextCursor: null });
    expect(page.history()).toEqual([null]);
  });

  it('returns to the first page when the server rejects an expired cursor', () => {
    const { page, streams } = create();
    streams[0].next({ items: [record], nextCursor: 'expired' });
    page.next();
    streams[1].error(new ApiRequestError(410, 'CURSOR_EXPIRED', 'Expired'));
    expect(streams.length).toBe(3);
    streams[2].next({ items: [record], nextCursor: null });
    expect(page.history()).toEqual([]);
    expect(page.error()).toBe(false);
  });
});
