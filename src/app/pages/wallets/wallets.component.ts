import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs';
import { SHARED_COMPONENTS, SHARED_IMPORTS } from '../../shared/base-imports';
import { BaseComponent } from '../../shared/components/base/base.component';
import { WalletService } from '../../core/services/wallet.service';
import { Wallet } from '../../models/wallet';
import { ToastService } from '../../shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-wallets',
  imports: [...SHARED_IMPORTS, ...SHARED_COMPONENTS],
  templateUrl: './wallets.component.html',
  styleUrl: './wallets.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletsComponent extends BaseComponent<Wallet> {
  private walletService = inject(WalletService);
  private toastService = inject(ToastService);
  private translateService = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);
  protected override fb = inject(FormBuilder);

  public wallets: Wallet[] = [];
  public isLoadingWallets = false;
  public isCreatingWallet = false;
  public togglingWalletId: string | null = null;

  public createForm = this.fb.group({
    walletName: ['', [Validators.required, Validators.maxLength(255)]],
    balance: [0, [Validators.required, Validators.min(0)]],
    description: ['', [Validators.maxLength(500)]],
  });

  protected override service = null as any;

  protected override initForms(): void {
    // No base forms needed for wallets page.
  }

  protected override onBrowserInit(): void {
    this.loadWallets();
  }

  protected loadWallets(): void {
    if (this.isLoadingWallets) {
      return;
    }

    this.isLoadingWallets = true;

    this.walletService
      .getMyWallets()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoadingWallets = false;
          this.refreshView();
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.wallets = response.data;
            this.refreshView();
            return;
          }

          this.wallets = [];
          this.toastService.error(response.message || this.translateService.instant('wallets.messages.loadError'));
          this.refreshView();
        },
        error: (error) => {
          this.wallets = [];
          const message = error?.error?.message || this.translateService.instant('wallets.messages.loadError');
          this.toastService.error(message);
          this.refreshView();
        },
      });
  }

  protected createWallet(): void {
    if (this.createForm.invalid || this.isCreatingWallet) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isCreatingWallet = true;
    const formValue = this.createForm.getRawValue();
    const request = {
      walletName: formValue.walletName?.trim() || '',
      balance: Number(formValue.balance || 0),
      description: formValue.description?.trim() || undefined,
    };

    this.walletService
      .createWallet(request)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isCreatingWallet = false;
          this.refreshView();
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.toastService.success(this.translateService.instant('wallets.messages.createSuccess'));
            this.createForm.reset({ walletName: '', balance: 0, description: '' });
            this.loadWallets();
            return;
          }

          this.toastService.error(response.message || this.translateService.instant('wallets.messages.createError'));
        },
        error: (error) => {
          const message =
            error?.error?.message || this.translateService.instant('wallets.messages.createError');
          this.toastService.error(message);
          this.refreshView();
        },
      });
  }

  protected toggleWalletStatus(walletId: string): void {
    if (!walletId || this.togglingWalletId) {
      return;
    }

    this.togglingWalletId = walletId;

    this.walletService
      .toggleWalletStatus(walletId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.togglingWalletId = null;
          this.refreshView();
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toastService.success(this.translateService.instant('wallets.messages.toggleSuccess'));
            this.loadWallets();
            return;
          }

          this.toastService.error(response.message || this.translateService.instant('wallets.messages.toggleError'));
        },
        error: (error) => {
          const message =
            error?.error?.message || this.translateService.instant('wallets.messages.toggleError');
          this.toastService.error(message);
          this.refreshView();
        },
      });
  }

  private refreshView(): void {
    this.cdr.detectChanges();
  }

  protected trackByWalletId(_index: number, wallet: Wallet): string {
    return wallet.id;
  }

  protected getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-100 text-emerald-700';
      case 'INACTIVE':
        return 'bg-amber-100 text-amber-700';
      case 'ARCHIVED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }
}
