import { describe, expect, it } from 'vitest';
import { parseCustomer, parseCustomerPage } from './customer.api';

describe('customer API contracts', () => {
  const valid = { id: '018c', name: 'Example Customer', email: 'customer@example.test', status: 'active' };
  it('accepts a valid customer record', () => {
    expect(parseCustomer(valid)).toEqual(valid);
  });
  it('accepts cursor pages', () => {
    expect(parseCustomerPage({ items: [valid], nextCursor: 'opaque-token' }).nextCursor).toBe('opaque-token');
  });
  it('rejects invalid API data', () => {
    expect(() => parseCustomer({ ...valid, status: 'invalid' })).toThrow();
    expect(() => parseCustomerPage({ items: [valid], nextCursor: 10 })).toThrow();
  });
});
