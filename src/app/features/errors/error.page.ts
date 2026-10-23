import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  readonly status = this.route.snapshot.data['status'] as '401' | '403' | '500' | 'maintenance';
  readonly messageKey: TranslationKey = this.status === '401' ? 'error401' : this.status === '403'
    ? 'error403' : this.status === '500' ? 'error500' : 'errorMaintenance';
}
