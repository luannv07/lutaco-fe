import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import QRCode from 'qrcode';
import { Router } from '@angular/router';
import { SHARED_COMPONENTS, SHARED_IMPORTS } from '../../shared/base-imports';
import { PaymentService } from '../../core/services/payment.service';
import { PayOSCreatedData, PayOSEnvelope, PayOSUserTransaction } from '../../models/payment';
import { ToastService } from '../../shared/services/toast.service';
import { UserService } from '../../core/services/user.service';
import { ComboboxOption } from '../../shared/components/combobox/combobox.component';

@Component({
  selector: 'app-payment',
  imports: [...SHARED_IMPORTS, ...SHARED_COMPONENTS],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent {
  private readonly paymentService = inject(PaymentService);
  private readonly toastService = inject(ToastService);
  private readonly translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  readonly createLoading = signal<boolean>(false);
  readonly historyLoading = signal<boolean>(false);
  readonly createdResult = signal<PayOSEnvelope<PayOSCreatedData> | null>(null);
  readonly qrCodeDataUrl = signal<string>('');
  readonly paymentHistory = signal<PayOSUserTransaction[]>([]);
  readonly selectedStatus = signal<string>('');
  readonly orderCodeKeyword = signal<string>('');
  readonly historyPage = signal<number>(1);
  readonly historyPageSize = 8;
  private currentUserId = '';

  readonly statusOptions: ComboboxOption[] = [
    { value: '', label: this.translateService.instant('payment.history.statuses.all') },
    { value: 'PENDING', label: this.translateService.instant('payment.history.statuses.pending') },
    { value: 'PAID', label: this.translateService.instant('payment.history.statuses.paid') },
    { value: 'EXPIRED', label: this.translateService.instant('payment.history.statuses.expired') },
    { value: 'CANCELLED', label: this.translateService.instant('payment.history.statuses.cancelled') },
  ];

  readonly filteredHistory = computed(() => {
    const status = this.selectedStatus().trim().toUpperCase();
    const orderCodeKeyword = this.orderCodeKeyword().trim();

    const rows = this.paymentHistory().filter((transaction) => {
      const matchStatus = !status || transaction.status.toUpperCase() === status;
      const matchOrderCode =
        !orderCodeKeyword || transaction.orderCode.toString().includes(orderCodeKeyword);
      return matchStatus && matchOrderCode;
    });

    return rows.sort((first, second) => this.toTimestamp(second.createdDate) - this.toTimestamp(first.createdDate));
  });

  readonly totalHistoryItems = computed(() => this.filteredHistory().length);
  readonly totalHistoryPages = computed(() =>
    Math.max(1, Math.ceil(this.totalHistoryItems() / this.historyPageSize)),
  );
  readonly pagedHistory = computed(() => {
    const page = Math.min(this.historyPage(), this.totalHistoryPages());
    const startIndex = (page - 1) * this.historyPageSize;
    return this.filteredHistory().slice(startIndex, startIndex + this.historyPageSize);
  });

  constructor() {
    this.loadCurrentUserAndSetupPage();
  }

  protected getStatusClass(status: string): string {
    if (status === 'PAID' || status === 'COMPLETED' || status === 'SUCCESS') {
      return 'bg-emerald-100 text-emerald-700';
    }

    if (status === 'PENDING' || status === 'PARTIAL') {
      return 'bg-amber-100 text-amber-700';
    }

    if (!status) {
      return 'bg-slate-100 text-slate-700';
    }

    return 'bg-red-100 text-red-700';
  }

  protected createPremiumPayment(): void {
    if (this.createLoading()) {
      return;
    }

    this.createLoading.set(true);

    this.paymentService
      .createPremiumPayment()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.createLoading.set(false)),
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.createdResult.set(this.normalizeCreatedEnvelope(response.data));
            this.generateQrImage(response.data.data.qrCode);
            this.toastService.success(
              response.message || this.translateService.instant('payment.messages.createSuccess'),
            );
            this.loadPaymentHistory();
            return;
          }

          this.qrCodeDataUrl.set('');

          this.toastService.error(
            response.message || this.translateService.instant('payment.messages.createError'),
          );
        },
        error: (error: unknown) => {
          this.qrCodeDataUrl.set('');
          const message =
            (error as { error?: { message?: string } })?.error?.message ||
            this.translateService.instant('payment.messages.createError');
          this.toastService.error(message);
        },
      });
  }

  protected openCheckout(): void {
    const checkoutUrl = this.createdResult()?.data.checkoutUrl;
    if (!checkoutUrl) {
      this.toastService.warning(this.translateService.instant('payment.messages.checkoutMissing'));
      return;
    }

    window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
  }

  protected onStatusFilterChange(value: string): void {
    this.selectedStatus.set(value);
    this.historyPage.set(1);
  }

  protected onOrderCodeKeywordChange(value: string): void {
    this.orderCodeKeyword.set(value);
    this.historyPage.set(1);
  }

  protected clearHistoryFilters(): void {
    this.selectedStatus.set('');
    this.orderCodeKeyword.set('');
    this.historyPage.set(1);
  }

  protected getHistoryRowNumber(index: number): number {
    return (this.historyPage() - 1) * this.historyPageSize + index + 1;
  }

  protected goToPreviousHistoryPage(): void {
    if (this.historyPage() <= 1) {
      return;
    }

    this.historyPage.set(this.historyPage() - 1);
  }

  protected goToNextHistoryPage(): void {
    if (this.historyPage() >= this.totalHistoryPages()) {
      return;
    }

    this.historyPage.set(this.historyPage() + 1);
  }

  private generateQrImage(payload: string): void {
    if (!payload) {
      this.qrCodeDataUrl.set('');
      return;
    }

    QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 320,
    })
      .then((dataUrl: string) => {
        this.qrCodeDataUrl.set(dataUrl);
      })
      .catch(() => {
        this.qrCodeDataUrl.set('');
        this.toastService.warning(this.translateService.instant('payment.messages.qrBuildError'));
      });
  }

  private normalizeCreatedEnvelope(
    envelope: PayOSEnvelope<PayOSCreatedData>,
  ): PayOSEnvelope<PayOSCreatedData> {
    return envelope;
  }

  private loadCurrentUserAndSetupPage(): void {
    this.userService
      .getMySelf()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (!response.success || !response.data) {
            this.toastService.error(this.translateService.instant('payment.messages.historyError'));
            return;
          }

          this.currentUserId = response.data.id;

          if ((response.data.userPlan?.value || '').toUpperCase() === 'PREMIUM') {
            this.toastService.info(this.translateService.instant('payment.messages.alreadyPremium'));
            this.router.navigate(['/dashboard']);
            return;
          }

          this.loadPaymentHistory();
        },
        error: () => {
          this.toastService.error(this.translateService.instant('payment.messages.historyError'));
        },
      });
  }

  private loadPaymentHistory(): void {
    if (!this.currentUserId) {
      return;
    }

    this.historyLoading.set(true);
    this.paymentService
      .getTransactionsByUserId(this.currentUserId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.historyLoading.set(false)),
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.paymentHistory.set((response.data || []).map((item) => this.normalizeHistoryItem(item)));
            this.historyPage.set(1);
            return;
          }

          this.paymentHistory.set([]);
          this.toastService.error(
            response.message || this.translateService.instant('payment.messages.historyError'),
          );
        },
        error: (error: unknown) => {
          this.paymentHistory.set([]);
          const message =
            (error as { error?: { message?: string } })?.error?.message ||
            this.translateService.instant('payment.messages.historyError');
          this.toastService.error(message);
        },
      });
  }

  private normalizeHistoryItem(item: PayOSUserTransaction): PayOSUserTransaction {
    return {
      ...item,
      createdDate: this.normalizeUtcDateString(item.createdDate),
      paidAt: item.paidAt ? this.normalizeUtcDateString(item.paidAt) : null,
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

  private toTimestamp(value: string): number {
    if (!value) {
      return 0;
    }

    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }
}
