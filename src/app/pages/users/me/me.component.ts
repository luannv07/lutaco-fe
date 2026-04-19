import {
  Component,
  ChangeDetectionStrategy,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { UserService, UpdatePasswordRequest } from '../../../core/services/user.service';
import { ToastService } from '../../../shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { User, UserUpdateRequest } from '../../../models/user';
import { signal } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { SHARED_COMPONENTS, SHARED_IMPORTS } from '../../../shared/base-imports';

@Component({
  selector: 'app-me',
  standalone: true,
  imports: [...SHARED_COMPONENTS, ...SHARED_IMPORTS],
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeComponent extends BaseComponent<User> {
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private translateService = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  public user = signal<User | null>(null);
  public isLoading = signal(false);
  public error = signal<string | null>(null);
  public isEditingProfile = signal(false);
  public isChangingPassword = signal(false);
  public isSaving = signal(false);

  protected override fb = inject(FormBuilder);
  
  public editProfileForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
    address: ['', [Validators.maxLength(255)]],
    gender: [''],
  });

  public changePasswordForm: FormGroup = this.fb.group(
    {
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
      confirmNewPassword: ['', [Validators.required]],
    },
    {
      validators: this.passwordMatchValidator(),
    }
  );

  protected override service = null as any;

  protected override initForms(): void {
    // Forms are initialized in property declaration
  }

  protected override onBrowserInit(): void {
    this.loadUserInfo();
  }

  private passwordMatchValidator() {
    return (group: AbstractControl): ValidationErrors | null => {
      const newPassword = group.get('newPassword')?.value;
      const confirmNewPassword = group.get('confirmNewPassword')?.value;
      if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
        group.get('confirmNewPassword')?.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else if (group.get('confirmNewPassword')?.hasError('passwordMismatch')) {
        group.get('confirmNewPassword')?.setErrors(null);
      }
      return null;
    };
  }

  loadUserInfo(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.userService.getMySelf().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        if (response.data) {
          this.user.set(this.normalizeUserDateFields(response.data));
          this.editProfileForm.patchValue({
            fullName: response.data.fullName,
            address: response.data.address || '',
            gender: response.data.gender?.value || '',
          });
        }
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.error.set(this.translateService.instant('profile.messages.loadError'));
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  toggleEditProfileMode(): void {
    this.isEditingProfile.set(!this.isEditingProfile());
    if (this.isEditingProfile()) {
      const currentUser = this.user();
      if (currentUser) {
        this.editProfileForm.patchValue({
          fullName: currentUser.fullName,
          address: currentUser.address || '',
          gender: currentUser.gender?.value || '',
        });
      }
    } else {
      this.editProfileForm.reset();
    }
  }

  cancelEditProfile(): void {
    this.isEditingProfile.set(false);
    this.editProfileForm.reset();
  }

  saveProfileChanges(): void {
    if (this.editProfileForm.invalid) {
      this.editProfileForm.markAllAsTouched();
      return;
    }

    const currentUser = this.user();
    if (!currentUser) {
      this.error.set(this.translateService.instant('profile.messages.userNotFound'));
      return;
    }

    this.isSaving.set(true);
    const formValue = this.editProfileForm.value;
    const updateRequest: UserUpdateRequest = {
      fullName: formValue.fullName,
      address: formValue.address?.trim() !== '' ? formValue.address : undefined,
      ...(formValue.gender?.trim() ? { gender: formValue.gender } : {}),
    };

    this.userService.updateMyProfile(currentUser.id, updateRequest).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        if (response.data) {
          this.user.set(this.normalizeUserDateFields(response.data));
          this.isEditingProfile.set(false);
          this.toastService.success(this.translateService.instant('profile.messages.updateSuccess'));
        }
        this.isSaving.set(false);
        this.cdr.markForCheck();
      },
      error: (error) => {
        const errorMsg = error.error?.message || this.translateService.instant('profile.messages.updateError');
        this.toastService.error(errorMsg);
        this.isSaving.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  toggleChangePasswordMode(): void {
    this.isChangingPassword.set(!this.isChangingPassword());
    if (!this.isChangingPassword()) {
      this.changePasswordForm.reset();
    }
  }

  cancelChangePassword(): void {
    this.isChangingPassword.set(false);
    this.changePasswordForm.reset();
  }

  changePassword(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    const currentUser = this.user();
    if (!currentUser) {
      this.error.set(this.translateService.instant('profile.messages.userNotFound'));
      return;
    }

    this.isSaving.set(true);
    const formValue = this.changePasswordForm.value;
    const passwordRequest: UpdatePasswordRequest = {
      oldPassword: formValue.oldPassword,
      newPassword: formValue.newPassword,
      confirmNewPassword: formValue.confirmNewPassword,
    };

    this.userService.updatePassword(currentUser.id, passwordRequest).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.toastService.success(this.translateService.instant('profile.messages.passwordChangeSuccess'));
        this.isChangingPassword.set(false);
        this.changePasswordForm.reset();
        this.isSaving.set(false);
        this.cdr.markForCheck();
      },
      error: (error) => {
        const errorMsg = error.error?.message || this.translateService.instant('profile.messages.passwordChangeError');
        this.toastService.error(errorMsg);
        this.isSaving.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  private normalizeUserDateFields(user: User): User {
    return {
      ...user,
      createdDate: this.normalizeUtcDateString(user.createdDate),
      updatedDate: this.normalizeUtcDateString(user.updatedDate),
    };
  }

  private normalizeUtcDateString(value: string): string {
    if (!value) {
      return value;
    }

    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return trimmedValue;
    }

    const hasTimezone = /Z|[+-]\d{2}:\d{2}$/.test(trimmedValue);
    if (hasTimezone) {
      return trimmedValue;
    }

    const isoLikeValue = trimmedValue.includes('T')
      ? trimmedValue
      : trimmedValue.replace(' ', 'T');

    return `${isoLikeValue}Z`;
  }

  protected getGenderOptions() {
    return [
      { value: 'MALE', label: this.translateService.instant('profile.genders.male') },
      { value: 'FEMALE', label: this.translateService.instant('profile.genders.female') },
      { value: 'OTHER', label: this.translateService.instant('profile.genders.other') },
    ];
  }

  protected getPasswordErrorMessage(field: string): string {
    const formControl = this.changePasswordForm.get(field);
    if (!formControl || !formControl.errors) {
      return '';
    }

    if (formControl.hasError('required')) {
      return this.translateService.instant('validation.required');
    }
    if (formControl.hasError('minlength')) {
      return this.translateService.instant('validation.minLength', { length: 6 });
    }
    if (field === 'confirmNewPassword' && this.changePasswordForm.hasError('passwordMismatch')) {
      return this.translateService.instant('profile.messages.passwordMismatch');
    }
    return '';
  }

  protected hasPasswordError(field: string): boolean {
    const control = this.changePasswordForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}


