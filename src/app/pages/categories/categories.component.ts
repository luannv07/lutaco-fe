import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs';
import { SHARED_COMPONENTS, SHARED_IMPORTS } from '../../shared/base-imports';
import { BaseComponent } from '../../shared/components/base/base.component';
import { ComboboxOption } from '../../shared/components/combobox/combobox.component';
import { Category, CategoryFilter, CategoryRequest, CategoryType } from '../../models/category';
import { CategoryService } from '../../core/services/category.service';
import { ToastService } from '../../shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-categories',
  imports: [...SHARED_IMPORTS, ...SHARED_COMPONENTS],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent extends BaseComponent<Category> {
  private readonly categoryService = inject(CategoryService);
  private readonly toastService = inject(ToastService);
  private readonly translateService = inject(TranslateService);
  private readonly cdr = inject(ChangeDetectorRef);
  protected override fb = inject(FormBuilder);

  public categories: Category[] = [];
  public categoryOptions: ComboboxOption[] = [];
  public createParentOptions: ComboboxOption[] = [];
  public editParentOptions: ComboboxOption[] = [];
  public isLoadingCategories = false;
  public isCreatingCategory = false;
  public isUpdatingCategory = false;
  public editingCategoryId: string | null = null;
  public isCreateModalOpen = false;
  public isEditModalOpen = false;

  public readonly categoryTypeOptions: ComboboxOption[] = [
    { value: 'INCOME', label: this.translateService.instant('categories.types.income') },
    { value: 'EXPENSE', label: this.translateService.instant('categories.types.expense') },
  ];

  public readonly filterCategoryTypeOptions: ComboboxOption[] = [
    { value: '', label: this.translateService.instant('categories.types.all') },
    ...this.categoryTypeOptions,
  ];

  public filterForm = this.fb.group({
    categoryName: [''],
    categoryType: [''],
  });

  public createForm = this.fb.group({
    categoryName: ['', [Validators.required, Validators.maxLength(255)]],
    parentId: [''],
    categoryType: ['EXPENSE' as CategoryType],
  });

  public editForm = this.fb.group({
    categoryName: ['', [Validators.required, Validators.maxLength(255)]],
    parentId: [''],
    categoryType: ['EXPENSE' as CategoryType],
  });

  protected override service = null as never;

  protected override initForms(): void {
    // No base forms required.
  }

  protected override onBrowserInit(): void {
    this.loadCategories();
  }

  protected loadCategories(): void {
    if (this.isLoadingCategories) {
      return;
    }

    this.isLoadingCategories = true;
    const filter = this.buildFilter();

    this.categoryService
      .searchCategories(0, 100, filter)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoadingCategories = false;
          this.refreshView();
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data?.content) {
            this.categories = this.flattenCategories(response.data.content);
            this.categoryOptions = this.toCategoryOptions(this.categories);
            this.createParentOptions = this.getParentOptions();
            this.editParentOptions = this.editingCategoryId
              ? this.getParentOptions(this.editingCategoryId)
              : this.getParentOptions();
            this.refreshView();
            return;
          }

          this.categories = [];
          this.categoryOptions = [];
          this.createParentOptions = [];
          this.editParentOptions = [];
          this.toastService.error(
            response.message || this.translateService.instant('categories.messages.loadError'),
          );
          this.refreshView();
        },
        error: (error: unknown) => {
          const message =
            (error as { error?: { message?: string } })?.error?.message ||
            this.translateService.instant('categories.messages.loadError');
          this.toastService.error(message);
          this.categories = [];
          this.categoryOptions = [];
          this.createParentOptions = [];
          this.editParentOptions = [];
          this.refreshView();
        },
      });
  }

  protected applyFilters(): void {
    this.loadCategories();
  }

  protected resetFilters(): void {
    this.filterForm.reset({
      categoryName: '',
      categoryType: '',
    });
    this.loadCategories();
  }

  protected openCreateModal(): void {
    this.createForm.reset({
      categoryName: '',
      parentId: '',
      categoryType: 'EXPENSE',
    });
    this.createParentOptions = this.getParentOptions();
    this.isCreateModalOpen = true;
    this.refreshView();
  }

  protected closeCreateModal(): void {
    this.isCreateModalOpen = false;
    this.createForm.reset({
      categoryName: '',
      parentId: '',
      categoryType: 'EXPENSE',
    });
    this.refreshView();
  }

  protected onCreateParentChange(value: string): void {
    this.createForm.patchValue({ parentId: value });
  }

  protected onEditParentChange(value: string): void {
    this.editForm.patchValue({ parentId: value });
  }

  protected onFilterCategoryTypeChange(value: string): void {
    this.filterForm.patchValue({ categoryType: value });
  }

  protected onCreateCategoryTypeChange(value: string): void {
    this.createForm.patchValue({ categoryType: value as CategoryType });
  }

  protected onEditCategoryTypeChange(value: string): void {
    this.editForm.patchValue({ categoryType: value as CategoryType });
  }

  protected createCategory(): void {
    if (this.createForm.invalid || this.isCreatingCategory) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isCreatingCategory = true;
    const request = this.buildCategoryRequest(this.createForm.getRawValue());

    this.categoryService
      .createCategory(request)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isCreatingCategory = false;
          this.refreshView();
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toastService.success(this.translateService.instant('categories.messages.createSuccess'));
            this.closeCreateModal();
            this.loadCategories();
            return;
          }

          this.toastService.error(
            response.message || this.translateService.instant('categories.messages.createError'),
          );
        },
        error: (error: unknown) => {
          const message =
            (error as { error?: { message?: string } })?.error?.message ||
            this.translateService.instant('categories.messages.createError');
          this.toastService.error(message);
        },
      });
  }

  protected startEdit(category: Category): void {
    this.editingCategoryId = category.id;
    this.editForm.reset({
      categoryName: category.categoryName,
      parentId: category.parentId || '',
      categoryType: (category.categoryType?.value as CategoryType) || 'EXPENSE',
    });
    this.editParentOptions = this.getParentOptions(category.id);
    this.isEditModalOpen = true;
    this.refreshView();
  }

  protected cancelEdit(): void {
    this.editingCategoryId = null;
    this.isEditModalOpen = false;
    this.editForm.reset({
      categoryName: '',
      parentId: '',
      categoryType: 'EXPENSE',
    });
    this.editParentOptions = this.getParentOptions();
    this.refreshView();
  }

  protected saveEdit(categoryId: string): void {
    if (this.editForm.invalid || this.isUpdatingCategory) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isUpdatingCategory = true;
    const request = this.buildCategoryRequest(this.editForm.getRawValue());

    this.categoryService
      .updateCategory(categoryId, request)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isUpdatingCategory = false;
          this.refreshView();
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toastService.success(this.translateService.instant('categories.messages.updateSuccess'));
            this.cancelEdit();
            this.loadCategories();
            return;
          }

          this.toastService.error(
            response.message || this.translateService.instant('categories.messages.updateError'),
          );
        },
        error: (error: unknown) => {
          const message =
            (error as { error?: { message?: string } })?.error?.message ||
            this.translateService.instant('categories.messages.updateError');
          this.toastService.error(message);
        },
      });
  }

  protected getTypeBadgeClass(typeValue: string | undefined): string {
    return typeValue === 'INCOME'
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-red-100 text-red-700';
  }

  protected trackByCategoryId(_index: number, category: Category): string {
    return category.id;
  }

  private refreshView(): void {
    this.cdr.detectChanges();
  }

  private buildFilter(): CategoryFilter {
    const value = this.filterForm.getRawValue();

    return {
      categoryName: value.categoryName?.trim() || undefined,
      categoryType: this.normalizeCategoryType(value.categoryType),
    };
  }

  private buildCategoryRequest(value: {
    categoryName?: string | null;
    parentId?: string | null;
    categoryType?: CategoryType | string | null;
  }): CategoryRequest {
    return {
      categoryName: value.categoryName?.trim() || '',
      parentId: value.parentId?.trim() || undefined,
      categoryType: this.normalizeCategoryType(value.categoryType) || 'EXPENSE',
    };
  }

  private toCategoryOptions(categories: Category[]): ComboboxOption[] {
    return categories
      .map((category) => ({ value: category.id, label: category.categoryName }))
      .sort((first, second) => first.label.localeCompare(second.label));
  }

  private getParentOptions(excludedCategoryId?: string): ComboboxOption[] {
    return this.categoryOptions.filter((option) => option.value !== excludedCategoryId);
  }

  private normalizeCategoryType(value?: string | null): CategoryType | undefined {
    return value === 'INCOME' || value === 'EXPENSE' ? value : undefined;
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
