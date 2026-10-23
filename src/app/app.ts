import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { I18nService } from './core/i18n/i18n.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './templates/app/app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly i18n = inject(I18nService);

  setLanguage(value: string): void {
    if (value === 'id' || value === 'en') {
      this.i18n.setLanguage(value);
    }
  }
}
