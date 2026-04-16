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
import { BaseComponent } from '../../../shared/components/base/base.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [...SHARED_IMPORTS, ...SHARED_COMPONENTS],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent extends BaseComponent<any> {
  public override loading = false;
  public errorMessage = '';
  public toast: Toast = {
    title: 'common.ui.toast.info',
    type: 'info',
    message: 'common.ui.status.updating',
    visible: false,
  };
  protected override fb = inject(FormBuilder);
  public form: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  private authService = inject(AuthService);
  protected override router = inject(Router);
  private toastService: ToastService = inject(ToastService);
  private translateService = inject(TranslateService);
  private langService = inject(LanguageService);

  protected override service = null as any;

  protected override initForms(): void {
    // No forms to initialize for login
  }

  protected override onBrowserInit(): void {
    // Component is browser-ready
  }

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

  get overrideCurrentLang(): string {
    return this.langService.getCurrentLanguage();
  }

  translateKey(key: string): string {
    return this.translateService.instant(key);
  }

  showToast() {
    const title = this.translateKey(this.toast.title);
    const message = this.translateKey(this.toast.message);
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
          this.errorMessage = this.translateKey('common.validation.common.unexpectedError');
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error.message || this.translateKey('common.validation.common.unexpectedError');
        this.loading = false;
      },
    });
  }

  switchLang(): void {
    const next = this.overrideCurrentLang === 'vi' ? 'en' : 'vi';
    this.langService.setLanguage(next);
  }
}
