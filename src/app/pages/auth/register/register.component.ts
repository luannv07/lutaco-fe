import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { SHARED_COMPONENTS, SHARED_IMPORTS } from '../../../shared/base-imports';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { UserCreateRequest } from '../../../models/auth';
import { Subscription } from 'rxjs';

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
export class RegisterComponent implements OnInit, OnDestroy {
  loading = false;
  errorMessage = '';
  genderOptions: { value: string; label: string }[] = [];

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private translateService = inject(TranslateService);
  private langSub!: Subscription;

  form: FormGroup = this.fb.group(
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

  ngOnInit(): void {
    this.loadGenderOptions();

    this.langSub = this.translateService.onLangChange.subscribe(() => {
      this.loadGenderOptions();
    });
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

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
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
          this.router.navigate(['/auth/verify-otp']);
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
