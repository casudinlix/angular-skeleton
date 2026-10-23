import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, signal, viewChild,
} from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { UiButtonDirective } from '../../shared/ui/button.directive';
import { UiEmptyState } from '../../shared/ui/empty-state';
import { UiLoadingSpinner } from '../../shared/ui/loading-spinner';
import { ToastService } from '../../shared/ui/toast.service';
import { UiInputDirective } from '../../shared/ui/input.directive';
import { UiDataTableDirective } from '../../shared/ui/data-table.directive';
import { UiDialogDirective } from '../../shared/ui/dialog.directive';
import { CustomerApi } from './customer.api';
import { Customer, CustomerInput } from './customer.types';

@Component({
  imports: [ReactiveFormsModule, UiButtonDirective, UiEmptyState, UiLoadingSpinner, UiInputDirective, UiDataTableDirective, UiDialogDirective],
  templateUrl: '../../templates/customers/customers.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersPage {
  readonly i18n = inject(I18nService);
  readonly auth = inject(AuthService);
  private readonly api = inject(CustomerApi);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly editor = viewChild<ElementRef<HTMLDialogElement>>('editorDialog');
  private readonly removal = viewChild<ElementRef<HTMLDialogElement>>('removeDialog');

  readonly search = new FormControl('', { nonNullable: true });
  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    status: this.fb.control<'active' | 'inactive'>('active'),
  });

  readonly items = signal<readonly Customer[]>([]);
  readonly cursor = signal<string | null>(null);
  readonly history = signal<readonly (string | null)[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal(false);
  readonly editing = signal<Customer | null>(null);
  readonly pendingDelete = signal<Customer | null>(null);
  private requestSequence = 0;
  private currentCursor: string | null = null;

  constructor() {
    this.search.valueChanges.pipe(debounceTime(350), distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)).subscribe(() => this.loadPage(null, true));
    this.loadPage();
  }

  loadPage(cursor: string | null = this.currentCursor, resetHistory = false): void {
    const request = ++this.requestSequence;
    this.currentCursor = cursor;
    if (resetHistory) this.history.set([]);
    this.loading.set(true);
    this.error.set(false);
    this.api.list({ limit: 20, cursor: cursor ?? undefined, search: this.search.value.trim() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: page => {
          if (request !== this.requestSequence) return;
          this.items.set(page.items);
          this.cursor.set(page.nextCursor);
          this.loading.set(false);
        },
        error: () => {
          if (request !== this.requestSequence) return;
          this.items.set([]);
          this.cursor.set(null);
          this.loading.set(false);
          this.error.set(true);
        },
      });
  }

  next(): void {
    const nextCursor = this.cursor();
    if (!nextCursor || this.loading()) return;
    this.history.update(prev => [...prev, this.currentCursor]);
    this.loadPage(nextCursor);
  }
  previous(): void {
    const previous = this.history();
    if (!previous.length || this.loading()) return;
    this.history.set(previous.slice(0, -1));
    this.loadPage(previous[previous.length - 1]);
  }
  newCustomer(): void {
    this.editing.set(null);
    this.form.reset({ name: '', email: '', status: 'active' });
    this.editor()?.nativeElement.showModal();
  }
  editCustomer(item: Customer): void {
    this.editing.set(item);
    this.form.reset({ name: item.name, email: item.email, status: item.status });
    this.editor()?.nativeElement.showModal();
  }
  closeEditor(): void { this.editor()?.nativeElement.close(); }
  confirmDelete(item: Customer): void {
    this.pendingDelete.set(item);
    this.removal()?.nativeElement.showModal();
  }
  closeRemoval(): void { this.removal()?.nativeElement.close(); }

  async save(): Promise<void> {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const input: CustomerInput = this.form.getRawValue();
    try {
      const item = this.editing();
      if (item) await firstValueFrom(this.api.update(item.id, input));
      else await firstValueFrom(this.api.create(input));
      this.closeEditor();
      this.toast.show('success', this.i18n.translate('saved'));
      this.loadPage(null, true);
    } catch {
      this.toast.show('error', this.i18n.translate('operationFailed'));
    } finally { this.saving.set(false); }
  }

  async remove(): Promise<void> {
    const item = this.pendingDelete();
    if (!item || this.saving()) return;
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.remove(item.id));
      this.closeRemoval();
      this.pendingDelete.set(null);
      this.toast.show('success', this.i18n.translate('removed'));
      this.loadPage(null, true);
    } catch {
      this.toast.show('error', this.i18n.translate('operationFailed'));
    } finally { this.saving.set(false); }
  }
}
