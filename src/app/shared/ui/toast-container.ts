import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from './toast.service';
import { I18nService } from '../../core/i18n/i18n.service';
@Component({
  selector: 'ui-toast-container',
  templateUrl: '../../templates/shared/toast-container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiToastContainer {
  readonly toast = inject(ToastService);
  readonly i18n = inject(I18nService);
}
