import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { AuthService } from '../../core/auth/auth.service';
import { UiButtonDirective } from '../../shared/ui/button.directive';

@Component({
  imports: [RouterLink, UiButtonDirective],
  templateUrl: '../../templates/home/home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  readonly i18n = inject(I18nService);
  readonly auth = inject(AuthService);
  readonly count = signal(0);
}
