import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { I18nService, TranslationKey } from '../../core/i18n/i18n.service';
import { UiButtonDirective } from '../../shared/ui/button.directive';

@Component({
  imports: [RouterLink, UiButtonDirective],
  templateUrl: '../../templates/errors/error.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPage {
  readonly i18n = inject(I18nService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  readonly busy = signal(false);
  readonly failed = signal(false);
  readonly status = this.route.snapshot.data['status'] as '401' | '403' | '500' | 'maintenance';
  readonly messageKey: TranslationKey = this.status === '401' ? 'error401' : this.status === '403'
    ? 'error403' : this.status === '500' ? 'error500' : 'errorMaintenance';

  async retry(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.failed.set(false);
    try {
      const session = await this.auth.retry();
      if (session.status === 'unavailable') {
        this.failed.set(true);
        return;
      }
      const from = this.route.snapshot.queryParamMap.get('returnUrl');
      const destination = from?.startsWith('/') && !from.startsWith('//') && !from.startsWith('/login')
        ? from : session.status === 'authenticated' ? '/customers' : '/login';
      await this.router.navigateByUrl(destination);
    } finally {
      this.busy.set(false);
    }
  }
}
