import { Injectable, signal } from '@angular/core';
export type ToastKind = 'success' | 'error' | 'info';
export interface ToastMessage { readonly id: number; readonly kind: ToastKind; readonly message: string; }
@Injectable({ providedIn: 'root' })
export class ToastService {
  private sequence = 0;
  private readonly queue = signal<readonly ToastMessage[]>([]);
  readonly messages = this.queue.asReadonly();
  show(kind: ToastKind, message: string): void {
    this.queue.update(current => [...current.slice(-3), { id: ++this.sequence, kind, message }]);
  }
  dismiss(id: number): void { this.queue.update(current => current.filter(item => item.id !== id)); }
}
