import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild,
} from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, firstValueFrom, Subscription } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { HasPermissionDirective } from '../../core/auth/has-permission.directive';
import { ApiRequestError } from '../../core/http/api.types';
import { I18nService } from '../../core/i18n/i18n.service';
import { UiButtonDirective } from '../../shared/ui/button.directive';
import { UiFormField } from '../../shared/ui/form-field';
import { UiSelect, UiSelectOption } from '../../shared/ui/select';
import { UiBreadcrumbs, BreadcrumbItem } from '../../shared/ui/breadcrumbs';
import { UiDataTableDirective } from '../../shared/ui/data-table.directive';
import { UiDialogDirective } from '../../shared/ui/dialog.directive';
import { UiEmptyState } from '../../shared/ui/empty-state';
import { UiInputDirective } from '../../shared/ui/input.directive';
import { UiLoadingSpinner } from '../../shared/ui/loading-spinner';
import { ToastService } from '../../shared/ui/toast.service';
import { CustomerApi } from './customer.api';
import { Customer, CustomerInput } from './customer.types';

@Component({
  imports: [
    ReactiveFormsModule, UiButtonDirective, UiEmptyState, UiLoadingSpinner,
    UiInputDirective, UiDataTableDirective, UiDialogDirective, HasPermissionDirective,
    UiFormField, UiSelect, UiBreadcrumbs,
  ],
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

  readonly breadcrumbs = computed<readonly BreadcrumbItem[]>(() => [
    { label: this.i18n.translate('overview'), url: '/' },
    { label: this.i18n.translate('customersTitle') },
  ]);
  readonly statusOptions = computed<readonly UiSelectOption[]>(() => [
    { value: 'active', label: this.i18n.translate('active') },
    { value: 'inactive', label: this.i18n.translate('inactive') },
  ]);
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
  private listSubscription: Subscription | null = null;

  constructor() {
    this.search.valueChanges.pipe(
      debounceTime(350), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => this.loadPage(null, true));

    this.destroyRef.onDestroy(() => this.listSubscription?.unsubscribe());
    this.loadPage();
  }

  /**
   * Unsubscribe from the previous HttpClient request before requesting new data.
   * Only commit the cursor and its back-stack after a successful response.
   */
  loadPage(
    cursor: string | null = this.currentCursor,
    resetHistory = false,
    proposedHistory?: readonly (string | null)[],
  ): void {
    const requestId = ++this.requestSequence;
    this.listSubscription?.unsubscribe();
    this.loading.set(true);
    this.error.set(false);

    this.listSubscription = this.api.list({
      limit: 20, cursor: cursor ?? undefined, search: this.search.value.trim(),
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: page => {
        if (requestId !== this.requestSequence) return;
        this.currentCursor = cursor;
        this.items.set(page.items);
        this.cursor.set(page.nextCursor);
        if (resetHistory) this.history.set([]);
        else if (proposedHistory) this.history.set(proposedHistory);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        if (requestId !== this.requestSequence) return;
        // Opaque cursors can expire when records change or a tenant/filter changes.
        // Recover to the first page once, never retry arbitrary mutations.
        if (cursor !== null && error instanceof ApiRequestError &&
            (error.status === 400 || error.status === 410 || error.status === 422)) {
          this.loadPage(null, true);
          return;
        }
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  next(): void {
    const nextCursor = this.cursor();
    if (!nextCursor || this.loading()) return;
    this.loadPage(nextCursor, false, [...this.history(), this.currentCursor]);
  }

  previous(): void {
    const stack = this.history();
    if (!stack.length || this.loading()) return;
    this.loadPage(stack[stack.length - 1], false, stack.slice(0, -1));
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
    } finally {
      this.saving.set(false);
    }
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
    } finally {
      this.saving.set(false);
    }
  }
}
