import {
  Component,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User, UserUpdateRequest } from '../../../models/user';
import { signal } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { BaseComponent } from '../../../shared/components/base/base.component';

@Component({
  selector: 'app-me',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent, BadgeComponent],
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeComponent extends BaseComponent<User> {
  private userService = inject(UserService);

  public user = signal<User | null>(null);
  public isLoading = signal(false);
  public error = signal<string | null>(null);
  public isEditing = signal(false);
  public isSaving = signal(false);

  protected override fb = inject(FormBuilder);
  public editForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
    address: ['', [Validators.maxLength(255)]],
    gender: [''],
  });

  protected override service = null as any;

  protected override initForms(): void {
    // Form is initialized in property declaration
  }

  protected override onBrowserInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.userService.getMySelf().subscribe({
      next: (response) => {
        if (response.data) {
          this.user.set(response.data);
          this.editForm.patchValue({
            fullName: response.data.fullName,
            address: response.data.address || '',
            gender: response.data.gender?.value || '',
          });
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load user information');
        console.error('Error loading user:', error);
        this.isLoading.set(false);
      },
    });
  }

  toggleEditMode(): void {
    this.isEditing.set(!this.isEditing());
    if (this.isEditing()) {
      const currentUser = this.user();
      if (currentUser) {
        this.editForm.patchValue({
          fullName: currentUser.fullName,
          address: currentUser.address || '',
          gender: currentUser.gender?.value || '',
        });
      }
    }
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.editForm.reset();
  }

  saveChanges(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const currentUser = this.user();
    if (!currentUser) {
      console.error('No current user found');
      return;
    }

    this.isSaving.set(true);
    const formValue = this.editForm.value;
    const updateRequest: UserUpdateRequest = {
      fullName: formValue.fullName,
      address: formValue.address?.trim() !== '' ? formValue.address : undefined,
      ...(formValue.gender?.trim() ? { gender: formValue.gender } : {}),
    };

    this.userService.updateMyProfile(currentUser.id, updateRequest).subscribe({
      next: (response) => {
        if (response.data) {
          this.user.set(response.data);
          this.isEditing.set(false);
        }
        this.isSaving.set(false);
      },
      error: (error) => {
        console.error('Update error:', error);
        this.error.set(error.error?.message || 'Unable to update profile information');
        this.isSaving.set(false);
      },
    });
  }
}


