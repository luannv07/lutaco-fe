import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
import { Transaction, TransactionCreateRequest, TransactionFilter } from '../../models/transaction';
import { Wallet } from '../../models/wallet';
import {
  RecurringFrequentType,
  RecurringTransaction,
  RecurringTransactionRequest,
} from '../../models/recurring-transaction';
import { RecurringTransactionService } from '../../core/services/recurring-transaction.service';

@Component({
  selector: 'app-transactions',
  imports: [...SHARED_IMPORTS, ...SHARED_COMPONENTS],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent extends BaseComponent<Transaction> {
  private static readonly HO_CHI_MINH_OFFSET_MINUTES = 7 * 60;

  private readonly transactionService = inject(TransactionService);
  private readonly walletService = inject(WalletService);
  private readonly categoryService = inject(CategoryService);
  private readonly recurringTransactionService = inject(RecurringTransactionService);
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
  public createCategoryOptions: ComboboxOption[] = [];
  public createWalletOptions: ComboboxOption[] = [];
  public isCreateModalOpen = false;
  public isCreatingTransaction = false;
  public recurringTransactions: RecurringTransaction[] = [];
  public isLoadingRecurringTransactions = false;
  public isCreateRecurringModalOpen = false;
  public isCreatingRecurringTransaction = false;
  public selectedRecurringMode: 'EXPENSE' | 'INCOME' | null = null;
  public recurringTransactionOptions: ComboboxOption[] = [];
  public recurringSourceTransactions: Transaction[] = [];
  public recurringTypeOptions: ComboboxOption[] = [
    { value: 'DAILY', label: this.translateService.instant('transactions.recurring.types.daily') },
    { value: 'WEEKLY', label: this.translateService.instant('transactions.recurring.types.weekly') },
    { value: 'MONTHLY', label: this.translateService.instant('transactions.recurring.types.monthly') },
    { value: 'YEARLY', label: this.translateService.instant('transactions.recurring.types.yearly') },
  ];
  public recurringFilterTypeOptions: ComboboxOption[] = [
    { value: '', label: this.translateService.instant('transactions.recurring.types.all') },
    ...this.recurringTypeOptions,
  ];
  public tableSortField: 'transactionDate' | 'categoryName' | 'walletName' | 'amount' | 'note' =
    'transactionDate';
  public tableSortDirection: 'asc' | 'desc' = 'desc';

  public filterForm = this.fb.group({
    categoryName: [''],
    walletName: [''],
    fromDate: [''],
    toDate: [''],
    minAmount: [''],
    maxAmount: [''],
  });

  public createForm = this.fb.group({
    categoryId: ['', [Validators.required]],
    walletId: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(1)]],
    transactionDate: ['', [Validators.required]],
    note: ['', [Validators.maxLength(500)]],
  });

  public recurringFilterForm = this.fb.group({
    frequentType: [''],
  });

  public recurringForm = this.fb.group({
    transactionId: ['', [Validators.required]],
    frequentType: ['MONTHLY' as RecurringFrequentType, [Validators.required]],
    startDate: ['', [Validators.required]],
  });

  protected override service = null as never;

  protected override initForms(): void {
    // No base forms for this page.
  }

  protected override onBrowserInit(): void {
    this.loadCategoryNameOptions();
    this.loadWalletNameOptions();
    this.loadRecurringSourceTransactions();
    this.loadTransactions();
    this.loadRecurringTransactions();
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
            this.transactions = (response.data.content ?? []).map((transaction) =>
              this.normalizeTransactionDateFields(transaction),
            );
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
            this.createCategoryOptions = allCategories
              .filter((category) => Boolean(category.id))
              .map((category) => ({
                value: category.id,
                label: `${category.categoryName} (${category.categoryType.display})`,
              }))
              .sort((first, second) => first.label.localeCompare(second.label));
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
            this.createWalletOptions = this.toWalletOptions(response.data);
            this.refreshView();
          }
        },
        error: () => {
          this.toastService.warning(this.translateService.instant('transactions.messages.walletLoadError'));
        },
      });
  }

  protected onCreateCategoryChange(value: string): void {
    this.createForm.patchValue({ categoryId: value });
  }

  protected onCreateWalletChange(value: string): void {
    this.createForm.patchValue({ walletId: value });
  }

  protected openCreateTransaction(): void {
    if (this.isCreatingTransaction) {
      return;
    }

    this.isCreateModalOpen = true;
    this.createForm.reset({
      categoryId: '',
      walletId: '',
      amount: 0,
      transactionDate: this.getDefaultDateTimeLocal(),
      note: '',
    });
    this.refreshView();
  }

  protected closeCreateTransaction(): void {
    if (this.isCreatingTransaction) {
      return;
    }

    this.isCreateModalOpen = false;
    this.createForm.reset({
      categoryId: '',
      walletId: '',
      amount: 0,
      transactionDate: this.getDefaultDateTimeLocal(),
      note: '',
    });
    this.refreshView();
  }

  protected createTransaction(): void {
    if (this.createForm.invalid || this.isCreatingTransaction) {
      this.createForm.markAllAsTouched();
      return;
    }

    const request = this.buildCreateRequest();
    this.isCreatingTransaction = true;

    this.transactionService
      .createTransaction(request)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isCreatingTransaction = false;
          this.refreshView();
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toastService.success(this.translateService.instant('transactions.messages.createSuccess'));
            this.closeCreateTransaction();
            this.loadTransactions();
            return;
          }

          this.toastService.error(
            response.message || this.translateService.instant('transactions.messages.createError'),
          );
        },
        error: (error: unknown) => {
          const message =
            (error as { error?: { message?: string } })?.error?.message ||
            this.translateService.instant('transactions.messages.createError');
          this.toastService.error(message);
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

  protected syncTransactions(): void {
    if (this.isLoadingTransactions) {
      return;
    }

    this.toastService.info(this.translateService.instant('common.ui.status.updating'));
  }

  protected loadRecurringTransactions(): void {
    if (this.isLoadingRecurringTransactions) {
      return;
    }

    this.isLoadingRecurringTransactions = true;

    this.recurringTransactionService
      .searchRecurringTransactions({}, 0, 100)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoadingRecurringTransactions = false;
          this.refreshView();
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data?.content) {
            const selectedType = this.normalizeRecurringType(
              this.recurringFilterForm.getRawValue().frequentType,
            );
            const items = response.data.content;
            this.recurringTransactions = selectedType
              ? items.filter((item) => item.frequentType?.value === selectedType)
              : items;
            this.refreshView();
            return;
          }

          this.recurringTransactions = [];
          this.toastService.error(
            response.message || this.translateService.instant('transactions.messages.recurringLoadError'),
          );
          this.refreshView();
        },
        error: (error: unknown) => {
          this.recurringTransactions = [];
          const message =
            (error as { error?: { message?: string } })?.error?.message ||
            this.translateService.instant('transactions.messages.recurringLoadError');
          this.toastService.error(message);
          this.refreshView();
        },
      });
  }

  protected onRecurringFilterTypeChange(value: string): void {
    this.recurringFilterForm.patchValue({ frequentType: value });
  }

  protected applyRecurringFilters(): void {
    this.loadRecurringTransactions();
  }

  protected clearRecurringFilters(): void {
    this.recurringFilterForm.reset({ frequentType: '' });
    this.loadRecurringTransactions();
  }

  protected openCreateRecurring(mode: 'EXPENSE' | 'INCOME'): void {
    if (this.isCreatingRecurringTransaction) {
      return;
    }

    this.selectedRecurringMode = mode;
    this.recurringForm.reset({
      transactionId: '',
      frequentType: 'MONTHLY',
      startDate: this.getDefaultDateOnly(),
    });
    this.updateRecurringTransactionOptions();
    this.isCreateRecurringModalOpen = true;
    this.refreshView();
  }

  protected closeCreateRecurring(): void {
    if (this.isCreatingRecurringTransaction) {
      return;
    }

    this.isCreateRecurringModalOpen = false;
    this.selectedRecurringMode = null;
    this.recurringForm.reset({
      transactionId: '',
      frequentType: 'MONTHLY',
      startDate: this.getDefaultDateOnly(),
    });
    this.recurringTransactionOptions = [];
    this.refreshView();
  }

  protected onRecurringTransactionChange(value: string): void {
    this.recurringForm.patchValue({ transactionId: value });
  }

  protected onRecurringTypeChange(value: string): void {
    this.recurringForm.patchValue({ frequentType: value as RecurringFrequentType });
  }

  protected onRecurringStartDateChange(value: string): void {
    this.recurringForm.patchValue({ startDate: value });
  }

  protected createRecurringTransaction(): void {
    if (this.recurringForm.invalid || this.isCreatingRecurringTransaction) {
      this.recurringForm.markAllAsTouched();
      return;
    }

    const request = this.buildRecurringCreateRequest();
    this.isCreatingRecurringTransaction = true;

    this.recurringTransactionService
      .createRecurringTransaction(request)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isCreatingRecurringTransaction = false;
          this.refreshView();
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toastService.success(
              this.translateService.instant('transactions.messages.recurringCreateSuccess'),
            );
            this.closeCreateRecurring();
            this.loadRecurringTransactions();
            return;
          }

          this.toastService.error(
            response.message || this.translateService.instant('transactions.messages.recurringCreateError'),
          );
        },
        error: (error: unknown) => {
          const message =
            (error as { error?: { message?: string } })?.error?.message ||
            this.translateService.instant('transactions.messages.recurringCreateError');
          this.toastService.error(message);
        },
      });
  }

  protected deleteRecurringTransaction(id: number): void {
    if (!id || this.isLoadingRecurringTransactions) {
      return;
    }

    this.recurringTransactionService
      .deleteRecurringTransaction(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toastService.success(
              this.translateService.instant('transactions.messages.recurringDeleteSuccess'),
            );
            this.loadRecurringTransactions();
            return;
          }

          this.toastService.error(
            response.message || this.translateService.instant('transactions.messages.recurringDeleteError'),
          );
        },
        error: (error: unknown) => {
          const message =
            (error as { error?: { message?: string } })?.error?.message ||
            this.translateService.instant('transactions.messages.recurringDeleteError');
          this.toastService.error(message);
        },
      });
  }

  protected getRecurringSourceLabel(transactionId: string): string {
    const transaction = this.recurringSourceTransactions.find((item) => item.id === transactionId);
    if (!transaction) {
      return transactionId;
    }

    return `${transaction.categoryName} - ${transaction.amount.toLocaleString()} đ`;
  }

  protected getRecurringTypeLabel(value: string | undefined): string {
    if (value === 'DAILY') {
      return this.translateService.instant('transactions.recurring.types.daily');
    }

    if (value === 'WEEKLY') {
      return this.translateService.instant('transactions.recurring.types.weekly');
    }

    if (value === 'MONTHLY') {
      return this.translateService.instant('transactions.recurring.types.monthly');
    }

    if (value === 'YEARLY') {
      return this.translateService.instant('transactions.recurring.types.yearly');
    }

    return value || '-';
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

  protected get sortedTransactions(): Transaction[] {
    const rows = [...this.transactions];
    const direction = this.tableSortDirection === 'asc' ? 1 : -1;

    return rows.sort((first, second) => {
      const firstValue = this.getSortableValue(first, this.tableSortField);
      const secondValue = this.getSortableValue(second, this.tableSortField);
      return this.compareValues(firstValue, secondValue) * direction;
    });
  }

  protected sortBy(field: 'transactionDate' | 'categoryName' | 'walletName' | 'amount' | 'note'): void {
    if (this.tableSortField === field) {
      this.tableSortDirection = this.tableSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.tableSortField = field;
      this.tableSortDirection = field === 'transactionDate' ? 'desc' : 'asc';
    }

    this.refreshView();
  }

  protected getSortIconClass(field: 'transactionDate' | 'categoryName' | 'walletName' | 'amount' | 'note'): string {
    if (this.tableSortField !== field) {
      return 'fa-solid fa-sort text-slate-400';
    }

    return this.tableSortDirection === 'asc'
      ? 'fa-solid fa-sort-up text-indigo-600'
      : 'fa-solid fa-sort-down text-indigo-600';
  }

  protected getRowNumber(index: number): number {
    return this.pageIndex * this.pageSize + index + 1;
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

  private buildCreateRequest(): TransactionCreateRequest {
    const formValue = this.createForm.getRawValue();

    return {
      categoryId: (formValue.categoryId || '').trim(),
      walletId: (formValue.walletId || '').trim(),
      amount: Number(formValue.amount || 0),
      transactionDate: this.toIsoDateTime(formValue.transactionDate || ''),
      note: formValue.note?.trim() || undefined,
    };
  }

  private buildRecurringFilterRequest(): { frequentType?: RecurringFrequentType } {
    const value = this.recurringFilterForm.getRawValue();
    return {
      frequentType: this.normalizeRecurringType(value.frequentType),
    };
  }

  private buildRecurringCreateRequest(): RecurringTransactionRequest {
    const value = this.recurringForm.getRawValue();
    return {
      transactionId: (value.transactionId || '').trim(),
      frequentType: this.normalizeRecurringType(value.frequentType) || 'MONTHLY',
      startDate: value.startDate || this.getDefaultDateOnly(),
    };
  }

  private toIsoDateTime(dateTimeValue: string): string {
    const parsedDateTime = this.parseDateTimeLocal(dateTimeValue);
    if (!parsedDateTime) {
      return new Date().toISOString();
    }

    return this.hoChiMinhLocalToUtcIso(
      parsedDateTime.year,
      parsedDateTime.month,
      parsedDateTime.day,
      parsedDateTime.hour,
      parsedDateTime.minute,
      0,
      0,
    );
  }

  private getDefaultDateTimeLocal(): string {
    const offsetMs = TransactionsComponent.HO_CHI_MINH_OFFSET_MINUTES * 60 * 1000;
    const hoChiMinhNow = new Date(Date.now() + offsetMs);
    const year = hoChiMinhNow.getUTCFullYear();
    const month = String(hoChiMinhNow.getUTCMonth() + 1).padStart(2, '0');
    const day = String(hoChiMinhNow.getUTCDate()).padStart(2, '0');
    const hour = String(hoChiMinhNow.getUTCHours()).padStart(2, '0');
    const minute = String(hoChiMinhNow.getUTCMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hour}:${minute}`;
  }

  private getDefaultDateOnly(): string {
    const offsetMs = TransactionsComponent.HO_CHI_MINH_OFFSET_MINUTES * 60 * 1000;
    const hoChiMinhNow = new Date(Date.now() + offsetMs);
    const year = hoChiMinhNow.getUTCFullYear();
    const month = String(hoChiMinhNow.getUTCMonth() + 1).padStart(2, '0');
    const day = String(hoChiMinhNow.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private loadRecurringSourceTransactions(): void {
    this.transactionService
      .searchTransactions({}, 0, 100)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data?.content) {
            this.recurringSourceTransactions = response.data.content.map((transaction) =>
              this.normalizeTransactionDateFields(transaction),
            );
            this.updateRecurringTransactionOptions();
            this.refreshView();
          }
        },
      });
  }

  private updateRecurringTransactionOptions(): void {
    const filteredTransactions = this.recurringSourceTransactions.filter((transaction) => {
      if (!this.selectedRecurringMode) {
        return true;
      }

      return transaction.categoryType?.value === this.selectedRecurringMode;
    });

    this.recurringTransactionOptions = filteredTransactions
      .sort(
        (first, second) =>
          new Date(second.transactionDate).getTime() - new Date(first.transactionDate).getTime(),
      )
      .map((transaction) => ({
        value: transaction.id,
        label: `${transaction.categoryName} - ${transaction.amount.toLocaleString()} đ (${transaction.walletName})`,
      }));
  }

  private normalizeRecurringType(value?: string | null): RecurringFrequentType | undefined {
    if (value === 'DAILY' || value === 'WEEKLY' || value === 'MONTHLY' || value === 'YEARLY') {
      return value;
    }

    return undefined;
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
    const parsedDate = this.parseDateOnly(dateValue);
    if (!parsedDate) {
      return undefined;
    }

    return this.hoChiMinhLocalToUtcIso(parsedDate.year, parsedDate.month, parsedDate.day, 0, 0, 0, 0);
  }

  private toIsoDateEnd(dateValue: string): string | undefined {
    const parsedDate = this.parseDateOnly(dateValue);
    if (!parsedDate) {
      return undefined;
    }

    return this.hoChiMinhLocalToUtcIso(
      parsedDate.year,
      parsedDate.month,
      parsedDate.day,
      23,
      59,
      59,
      999,
    );
  }

  private parseDateOnly(dateValue: string): { year: number; month: number; day: number } | null {
    if (!dateValue) {
      return null;
    }

    const [year, month, day] = dateValue.split('-').map(Number);
    if (!year || !month || !day) {
      return null;
    }

    return { year, month, day };
  }

  private parseDateTimeLocal(
    dateTimeValue: string,
  ): { year: number; month: number; day: number; hour: number; minute: number } | null {
    if (!dateTimeValue || !dateTimeValue.includes('T')) {
      return null;
    }

    const [datePart, timePart] = dateTimeValue.split('T');
    const parsedDate = this.parseDateOnly(datePart);
    if (!parsedDate) {
      return null;
    }

    const [hour, minute] = timePart.split(':').map(Number);
    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      return null;
    }

    return {
      year: parsedDate.year,
      month: parsedDate.month,
      day: parsedDate.day,
      hour,
      minute,
    };
  }

  private hoChiMinhLocalToUtcIso(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    millisecond: number,
  ): string {
    const offsetMs = TransactionsComponent.HO_CHI_MINH_OFFSET_MINUTES * 60 * 1000;
    const utcMs = Date.UTC(year, month - 1, day, hour, minute, second, millisecond) - offsetMs;
    return new Date(utcMs).toISOString();
  }

  private toComboboxOptions(values: string[]): ComboboxOption[] {
    return values
      .sort((first, second) => first.localeCompare(second))
      .map((value) => ({ value, label: value }));
  }

  private toWalletOptions(wallets: Wallet[]): ComboboxOption[] {
    return wallets
      .map((wallet) => ({ value: wallet.id, label: wallet.walletName }))
      .sort((first, second) => first.label.localeCompare(second.label));
  }

  private normalizeTransactionDateFields(transaction: Transaction): Transaction {
    return {
      ...transaction,
      transactionDate: this.normalizeUtcDateString(transaction.transactionDate),
      createdDate: this.normalizeUtcDateString(transaction.createdDate),
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

  private getSortableValue(
    transaction: Transaction,
    field: 'transactionDate' | 'categoryName' | 'walletName' | 'amount' | 'note',
  ): string | number {
    if (field === 'transactionDate') {
      return new Date(transaction.transactionDate).getTime() || 0;
    }

    if (field === 'amount') {
      return Number(transaction.amount || 0);
    }

    return (transaction[field] || '').toString().toLowerCase();
  }

  private compareValues(first: string | number, second: string | number): number {
    if (typeof first === 'number' && typeof second === 'number') {
      return first - second;
    }

    return String(first).localeCompare(String(second));
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
