import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { CustomerApi } from './customer.api';
import { Customer } from './customer.types';

@Component({
  imports: [RouterLink],
  templateUrl: '../../templates/customers/customers.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersPage {
  readonly i18n = inject(I18nService);
  private readonly api = inject(CustomerApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly items = signal<readonly Customer[]>([]);
  readonly cursor = signal<string | null>(null);
  readonly loading = signal(false);
  readonly error = signal(false);

  private sequence = 0;

  constructor() {
    this.load();
  }

  load(cursor?: string): void {
    const id = ++this.sequence;
    this.loading.set(true);
    this.error.set(false);

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
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }

  next(): void {
    const cursor = this.cursor();
    if (cursor) this.load(cursor);
  }
}
