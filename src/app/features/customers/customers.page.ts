import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CustomerApi } from './customer.api';
import { Customer } from './customer.types';

@Component({
  imports: [RouterLink],
  templateUrl: '../../templates/customers/customers.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersPage {
  private readonly api = inject(CustomerApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly items = signal<readonly Customer[]>([]);
  readonly cursor = signal<string | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private sequence = 0;

  constructor() {
    this.load();
  }

  load(cursor?: string): void {
    const id = ++this.sequence;
    this.loading.set(true);
    this.error.set(null);

    this.api
      .list({ limit: 20, cursor })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (page) => {
          if (id !== this.sequence) return;
          this.items.set(page.items);
          this.cursor.set(page.nextCursor);
          this.loading.set(false);
        },
        error: () => {
          if (id !== this.sequence) return;
          this.items.set([]);
          this.cursor.set(null);
          this.error.set('API unavailable. Configure /api/customers.');
          this.loading.set(false);
        },
      });
  }

  next(): void {
    const cursor = this.cursor();
    if (cursor) this.load(cursor);
  }
}
