import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_COMPONENTS, SHARED_IMPORTS } from '../../../shared/base-imports';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/i18n/language.service';
import { Toast } from '../../../shared/models/toast.model';
import { ToastService } from '../../../shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { LoginRequest } from '../../../models/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [...SHARED_IMPORTS, ...SHARED_COMPONENTS],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loading = false;
  errorMessage = '';
  toast: Toast = {
    title: 'common.ui.toast.info',
    type: 'info',
    message: 'common.ui.status.updating',
    visible: false,
  };
  private fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService: ToastService = inject(ToastService);
  private translateService = inject(TranslateService);
  private langService = inject(LanguageService);

  get usernameError(): string {
    const ctrl = this.form.get('username');
    if (ctrl?.touched && ctrl?.hasError('required'))
      return 'auth.login.validation.username.required';
    return '';
  }

  get passwordError(): string {
    const ctrl = this.form.get('password');
    if (ctrl?.touched && ctrl?.hasError('required'))
      return 'auth.login.validation.password.required';
    return '';
  }

  get currentLang(): string {
    return this.langService.getCurrentLanguage();
  }

  /**
   * Translates a given key.
   * @param key The translation key.
   * @returns The translated string.
   */
  translate(key: string): string {
    return this.translateService.instant(key);
  }

  showToast() {
    const title = this.translate(this.toast.title);
    const message = this.translate(this.toast.message);
    this.toastService.info(title, message);
  }

  onUsernameChange(value: string | number) {
    this.form.get('username')?.setValue(value);
    this.form.get('username')?.markAsTouched();
  }

  onPasswordChange(value: string | number) {
    this.form.get('password')?.setValue(value);
    this.form.get('password')?.markAsTouched();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const loginRequest: LoginRequest = this.form.value;

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = this.translate('common.validation.common.unexpectedError');
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error.message || this.translate('common.validation.common.unexpectedError');
        this.loading = false;
      },
    });
  }

  switchLang(): void {
    const next = this.currentLang === 'vi' ? 'en' : 'vi';
    this.langService.setLanguage(next);
  }
}
