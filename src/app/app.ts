import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { I18nService } from './core/i18n/i18n.service';
import { AuthService } from './core/auth/auth.service';
import { ThemeService } from './core/theme/theme.service';
import { ToastService } from './shared/ui/toast.service';
import { UiToastContainer } from './shared/ui/toast-container';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, UiToastContainer],
  templateUrl: './templates/app/app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly i18n = inject(I18nService);
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  readonly toast = inject(ToastService);
  readonly menuOpen = signal(false);
  private readonly router = inject(Router);

  setLanguage(value: string): void {
    if (value === 'id' || value === 'en') this.i18n.setLanguage(value);
  }
  closeMenu(): void { this.menuOpen.set(false); }
  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
      await this.router.navigateByUrl('/');
    } catch {
      this.toast.show('error', this.i18n.translate('operationFailed'));
    }
  }
}
