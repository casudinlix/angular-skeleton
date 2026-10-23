import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { UiInputDirective } from '../../shared/ui/input.directive';
import { UiButtonDirective } from '../../shared/ui/button.directive';

@Component({
  imports: [ReactiveFormsModule, RouterLink, UiButtonDirective, UiInputDirective],
  templateUrl: '../../templates/auth/login.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  readonly i18n = inject(I18nService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly busy = signal(false);
  readonly failed = signal(false);
  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async submit(): Promise<void> {
    if (this.busy()) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.busy.set(true);
    this.failed.set(false);
    try {
      const { email, password } = this.form.getRawValue();
      await this.auth.signIn(email, password);
      const original = this.route.snapshot.queryParamMap.get('returnUrl');
      const destination = original?.startsWith('/') && !original.startsWith('//') && !original.startsWith('/login')
        ? original : '/customers';
      await this.router.navigateByUrl(destination);
    } catch {
      this.failed.set(true);
    } finally {
      this.busy.set(false);
      this.form.controls.password.reset();
    }
  }
}
