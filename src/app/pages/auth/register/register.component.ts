import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { SHARED_COMPONENTS, SHARED_IMPORTS } from '../../../shared/base-imports';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { UserCreateRequest } from '../../../models/auth';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../../../shared/components/base/base.component';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [...SHARED_IMPORTS, ...SHARED_COMPONENTS],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent extends BaseComponent<any> {
  public override loading = false;
  public errorMessage = '';
  public genderOptions: { value: string; label: string }[] = [];

  protected override fb = inject(FormBuilder);
  private authService = inject(AuthService);
  protected override router = inject(Router);
  private toastService = inject(ToastService);
  private translateService = inject(TranslateService);
  private langSub!: Subscription;

  protected override service = null as any;

  public form: FormGroup = this.fb.group(
    {
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      address: ['', [Validators.maxLength(255)]],
      gender: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  protected override initForms(): void {
    // Form initialized in property declaration above
  }

  protected override onBrowserInit(): void {
    this.loadGenderOptions();
    this.langSub = this.translateService.onLangChange.subscribe(() => {
      this.loadGenderOptions();
    });
  }

  override ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    super.ngOnDestroy();
  }

  private loadGenderOptions(): void {
    this.translateService
      .get([
        'auth.register.fields.gender.options.male',
        'auth.register.fields.gender.options.female',
        'auth.register.fields.gender.options.other',
      ])
      .subscribe((translations) => {
        this.genderOptions = [
          { value: 'MALE', label: translations['auth.register.fields.gender.options.male'] },
          { value: 'FEMALE', label: translations['auth.register.fields.gender.options.female'] },
          { value: 'OTHER', label: translations['auth.register.fields.gender.options.other'] },
        ];
      });
  }


  getError(field: string): string {
    const ctrl = this.form.get(field);
    if (!ctrl?.touched) return '';

    if (ctrl.hasError('required')) return `auth.register.validation.${field}.required`;
    if (ctrl.hasError('minlength')) return `auth.register.validation.${field}.minLength`;
    if (ctrl.hasError('maxlength')) return `auth.register.validation.${field}.maxLength`;
    if (ctrl.hasError('email')) return 'auth.register.validation.email.invalid';

    if (field === 'confirmPassword' && this.form.hasError('passwordMismatch')) {
      return 'auth.register.validation.confirmPassword.mismatch';
    }

    return '';
  }

  onFieldChange(field: string, value: string | number): void {
    this.form.get(field)?.setValue(value);
    this.form.get(field)?.markAsTouched();
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { confirmPassword, ...rest } = this.form.value;
    const request: UserCreateRequest = rest;

    this.authService.register(request).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = this.translateService.instant('common.errors.unexpectedError');
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message ?? this.translateService.instant('common.errors.unexpectedError');
        this.loading = false;
      },
    });
  }
}
