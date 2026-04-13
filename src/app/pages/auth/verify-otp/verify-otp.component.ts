import { Component, ElementRef, inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_COMPONENTS, SHARED_IMPORTS } from '../../../shared/base-imports';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [...SHARED_IMPORTS, ...SHARED_COMPONENTS],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css',
})
export class VerifyOtpComponent implements OnInit, OnDestroy {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  readonly otpIndexes = [0, 1, 2, 3, 4, 5];
  otpValues: string[] = ['', '', '', '', '', ''];

  loading = false;
  resendLoading = false;
  resendCooldown = 0;
  errorMessage = '';
  successMessage = '';

  private cooldownInterval: any;
  private authService = inject(AuthService);
  private router = inject(Router);
  private translateService = inject(TranslateService);
  private toastService = inject(ToastService);

  get otp(): string {
    return this.otpValues.join('');
  }

  ngOnInit(): void {
    this.startCooldown(60);
  }

  ngOnDestroy(): void {
    clearInterval(this.cooldownInterval);
  }

  // ── OTP input handlers ──────────────────────────────────────────────────────

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const digit = input.value.replace(/\D/g, '').slice(-1);
    this.otpValues[index] = digit;
    input.value = digit;

    if (digit && index < 5) {
      this.focusInput(index + 1);
    }

    this.errorMessage = '';
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      if (this.otpValues[index]) {
        this.otpValues[index] = '';
      } else if (index > 0) {
        this.otpValues[index - 1] = '';
        this.focusInput(index - 1);
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') ?? '';
    const digits = text.replace(/\D/g, '').slice(0, 6).split('');
    digits.forEach((d, i) => {
      if (i < 6) this.otpValues[i] = d;
    });
    const lastIndex = Math.min(digits.length, 5);
    this.focusInput(lastIndex);
  }

  private focusInput(index: number): void {
    setTimeout(() => {
      const inputs = this.otpInputs.toArray();
      inputs[index]?.nativeElement.focus();
    });
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  onSubmit(): void {
    if (this.otp.length < 6) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.verifyOtp(this.otp).subscribe({
      next: (response) => {
        if (response.success) {
          const title = this.translateService.instant('common.ui.toast.success');
          const message = this.translateService.instant('auth.verifyOtp.messages.successMessage');
          this.toastService.success(title, message);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = this.translateService.instant(
            'common.validation.common.unexpectedError',
          );
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message ??
          this.translateService.instant('common.validation.common.unexpectedError');
        this.otpValues = ['', '', '', '', '', ''];
        this.focusInput(0);
        this.loading = false;
      },
    });
  }

  // ── Resend ──────────────────────────────────────────────────────────────────

  resendOtp(): void {
    this.resendLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.resendOtp().subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = this.translateService.instant(
            'auth.verifyOtp.messages.resendSuccess',
          );
          this.startCooldown(60);
        }
        this.resendLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message ??
          this.translateService.instant('common.validation.common.unexpectedError');
        this.resendLoading = false;
      },
    });
  }

  private startCooldown(seconds: number): void {
    this.resendCooldown = seconds;
    clearInterval(this.cooldownInterval);
    this.cooldownInterval = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) clearInterval(this.cooldownInterval);
    }, 1000);
  }
}
