import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BaseResponse } from '../../../models/base-response';
import { ApiEndpoints } from '../../../shared/constants/api.constants';
import { finalize } from 'rxjs';
import { SHARED_COMPONENTS, SHARED_IMPORTS } from '../../../shared/base-imports';
import { AuthData, AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/i18n/language.service';
import { Toast } from '../../../shared/models/toast.model';
import { ToastService } from '../../../shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [...SHARED_IMPORTS, ...SHARED_COMPONENTS],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService: ToastService = inject(ToastService);
  private translateService = inject(TranslateService);
  private langService = inject(LanguageService);
  // private datePipe = inject(DatePipe);

  loading = false;
  errorMessage = '';

  form: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  toast: Toast = {
    title: 'common.toast.info',
    type: 'info',
    message: 'common.updating',
    visible: false,
  };

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

  get usernameError(): string {
    const ctrl = this.form.get('username');
    if (ctrl?.touched && ctrl?.hasError('required')) return 'auth.login.errors.username_required';
    return '';
  }

  get passwordError(): string {
    const ctrl = this.form.get('password');
    if (ctrl?.touched && ctrl?.hasError('required')) return 'auth.login.errors.password_required';
    return '';
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

    this.http
      .post<BaseResponse<AuthData>>(
        `${environment.baseUrl}/${ApiEndpoints.AUTH.LOGIN}`,
        this.form.value,
      )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.authService.login(res.data);
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = res.message || 'auth.login.errors.failed';
          }
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'auth.login.errors.failed';
          if (err?.error?.params?.retryAt) {
            this.errorMessage = this.errorMessage.concat('(' + err?.error?.params.retryAt + ')');
          }
        },
      });
  }

  get currentLang(): string {
    return this.langService.getCurrentLanguage();
  }
  switchLang(): void {
    const next = this.currentLang === 'vi' ? 'en' : 'vi';
    this.langService.setLanguage(next);
  }
}
