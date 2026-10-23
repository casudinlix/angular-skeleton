import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { UiButtonDirective } from '../../shared/ui/button.directive';
@Component({
  imports: [RouterLink, UiButtonDirective],
  templateUrl: '../../templates/errors/not-found.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {
  readonly i18n = inject(I18nService);
}
