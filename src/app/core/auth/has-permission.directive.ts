import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { AuthService } from './auth.service';

/** UI presentation only. The backend must authorize every request. */
@Directive({ selector: '[hasPermission]' })
export class HasPermissionDirective {
  readonly permission = input<string>('', { alias: 'hasPermission' });
  private readonly template = inject(TemplateRef<unknown>);
  private readonly container = inject(ViewContainerRef);
  private readonly auth = inject(AuthService);
  private visible = false;

  constructor() {
    effect(() => {
      const state = this.auth.state();
      const requiredPermission = this.permission();
      const allowed = state.status === 'authenticated' &&
        state.identity.permissions.includes(requiredPermission);
      if (allowed && !this.visible) {
        this.container.createEmbeddedView(this.template);
        this.visible = true;
      } else if (!allowed && this.visible) {
        this.container.clear();
        this.visible = false;
      }
    });
  }
}
