import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs';
import { SHARED_COMPONENTS, SHARED_IMPORTS } from '../../shared/base-imports';
import { TransactionService } from '../../core/services/transaction.service';
import { WalletService } from '../../core/services/wallet.service';
import { CategoryService } from '../../core/services/category.service';
import { ToastService } from '../../shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../../shared/components/base/base.component';
import { ComboboxOption } from '../../shared/components/combobox/combobox.component';
import { Category } from '../../models/category';
import { Transaction, TransactionFilter } from '../../models/transaction';

@Component({
  selector: 'app-transactions',
  imports: [...SHARED_IMPORTS, ...SHARED_COMPONENTS],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent extends BaseComponent<Transaction> {
  private readonly transactionService = inject(TransactionService);
  private readonly walletService = inject(WalletService);
  private readonly categoryService = inject(CategoryService);
  private readonly toastService = inject(ToastService);
  private readonly translateService = inject(TranslateService);
  private readonly cdr = inject(ChangeDetectorRef);
  protected override fb = inject(FormBuilder);

  public transactions: Transaction[] = [];
  public isLoadingTransactions = false;
  public totalItems = 0;
  public pageIndex = 0;
  public pageSize = 10;
  public categoryNameOptions: ComboboxOption[] = [];
  public walletNameOptions: ComboboxOption[] = [];

  public filterForm = this.fb.group({
    categoryName: [''],
    walletName: [''],
    fromDate: [''],
    toDate: [''],
    minAmount: [''],
    maxAmount: [''],
  });

  protected override service = null as never;

  protected override initForms(): void {
    // No base forms for this page.
  }

  protected override onBrowserInit(): void {
    this.loadCategoryNameOptions();
    this.loadWalletNameOptions();
    this.loadTransactions();
  }

  protected loadTransactions(): void {
    if (this.isLoadingTransactions) {
      return;
    }

    this.isLoadingTransactions = true;
    const filter = this.buildFilterRequest();

    this.transactionService
      .searchTransactions(filter, this.pageIndex, this.pageSize)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoadingTransactions = false;
          this.refreshView();
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.transactions = response.data.content ?? [];
            this.totalItems = response.data.totalElements ?? 0;
            this.refreshView();
            return;
          }

          this.transactions = [];
          this.totalItems = 0;
          this.toastService.error(
            response.message || this.translateService.instant('transactions.messages.loadError'),
          );
          this.refreshView();
        },
        error: (error: unknown) => {
          this.transactions = [];
          this.totalItems = 0;
          const message =
            (error as { error?: { message?: string } })?.error?.message ||
            this.translateService.instant('transactions.messages.loadError');
          this.toastService.error(message);
          this.refreshView();
        },
      });
  }

  private loadCategoryNameOptions(): void {
    this.categoryService
      .searchCategories(0, 100)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data?.content) {
            const allCategories = this.flattenCategories(response.data.content);
            this.categoryNameOptions = this.toComboboxOptions(
              Array.from(new Set(allCategories.map((category) => category.categoryName).filter(Boolean))),
            );
            this.refreshView();
          }
        },
        error: () => {
          this.toastService.warning(this.translateService.instant('transactions.messages.categoryLoadError'));
        },
      });
  }

  private loadWalletNameOptions(): void {
    this.walletService
      .getMyWallets()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.walletNameOptions = this.toComboboxOptions(
              Array.from(new Set(response.data.map((wallet) => wallet.walletName).filter(Boolean))),
            );
            this.refreshView();
          }
        },
      });
  }

  protected onCategoryNameChange(value: string): void {
    this.filterForm.patchValue({ categoryName: value });
  }

  protected onWalletNameChange(value: string): void {
    this.filterForm.patchValue({ walletName: value });
  }

  protected onFromDateChange(value: string): void {
    this.filterForm.patchValue({ fromDate: value });
  }

  protected onToDateChange(value: string): void {
    this.filterForm.patchValue({ toDate: value });
  }

  protected applyFilters(): void {
    this.pageIndex = 0;
    this.loadTransactions();
  }

  protected clearFilters(): void {
    this.filterForm.reset({
      categoryName: '',
      walletName: '',
      fromDate: '',
      toDate: '',
      minAmount: '',
      maxAmount: '',
    });
    this.pageIndex = 0;
    this.loadTransactions();
  }

  protected goToPreviousPage(): void {
    if (this.pageIndex === 0 || this.isLoadingTransactions) {
      return;
    }

    this.pageIndex -= 1;
    this.loadTransactions();
  }

  protected goToNextPage(): void {
    if (!this.hasNextPage() || this.isLoadingTransactions) {
      return;
    }

    this.pageIndex += 1;
    this.loadTransactions();
  }

  protected hasNextPage(): boolean {
    return (this.pageIndex + 1) * this.pageSize < this.totalItems;
  }

  protected getCategoryBadgeClass(categoryTypeValue: string): string {
    return categoryTypeValue === 'INCOME'
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-red-100 text-red-700';
  }

  protected trackByTransactionId(_index: number, transaction: Transaction): string {
    return transaction.id;
  }

  private refreshView(): void {
    this.cdr.detectChanges();
  }

  private buildFilterRequest(): TransactionFilter {
    const formValue = this.filterForm.getRawValue();

    return {
      categoryName: formValue.categoryName?.trim() || undefined,
      walletName: formValue.walletName?.trim() || undefined,
      fromDate: this.toIsoDateStart(formValue.fromDate || ''),
      toDate: this.toIsoDateEnd(formValue.toDate || ''),
      minAmount: formValue.minAmount !== '' ? Number(formValue.minAmount) : undefined,
      maxAmount: formValue.maxAmount !== '' ? Number(formValue.maxAmount) : undefined,
    };
  }

  private toIsoDateStart(dateValue: string): string | undefined {
    if (!dateValue) {
      return undefined;
    }

    return `${dateValue}T00:00:00`;
  }

  private toIsoDateEnd(dateValue: string): string | undefined {
    if (!dateValue) {
      return undefined;
    }

    return `${dateValue}T23:59:59`;
  }

  private toComboboxOptions(values: string[]): ComboboxOption[] {
    return values
      .sort((first, second) => first.localeCompare(second))
      .map((value) => ({ value, label: value }));
  }

  private flattenCategories(categories: Category[]): Category[] {
    const flattened: Category[] = [];

    categories.forEach((category) => {
      flattened.push(category);
      if (category.children && category.children.length > 0) {
        flattened.push(...this.flattenCategories(category.children));
      }
    });

    return flattened;
  }
}
