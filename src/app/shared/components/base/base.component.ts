import { Directive, inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core'; // Import TranslateService
import { Page } from '../../../models/page';
import { BaseResponse } from '../../../models/base-response';
import { LanguageService } from '../../../core/i18n/language.service';
import { BaseService } from '../../services/base.service';

// Define a generic type for entities that have an ID.
type Entity = { id: string | number };

/**
 * A comprehensive, abstract base component designed for list and detail pages.
 * It provides built-in functionality for data fetching, form handling, pagination,
 * sorting, selection, and lifecycle management, and i18n integration.
 * Automatically skips initialization on server-side rendering.
 *
 * @template T The main entity type for the component (e.g., User, Product).
 */
@Directive() // Use @Directive for abstract base classes that are not directly rendered
export abstract class BaseComponent<T extends Entity> implements OnInit, OnDestroy {
  //================================================================
  // Platform Check
  //================================================================
  protected platformId = inject(PLATFORM_ID);

  //================================================================
  // Abstract & Core Properties
  //================================================================
  public loading = false;

  //================================================================
  // Injected Services
  //================================================================
  public isSubmitting = false;
  public isEditMode = false;
  public currentId: string | number | null = null;
  public searchForm!: FormGroup;
  public detailForm!: FormGroup;

  //================================================================
  // State Management
  //================================================================
  public items: T[] = []; // Array of entities for list display
  //================================================================
  public currentPage = 0; // Current page index (0-based)
  public itemsPerPage = 10; // Number of items per page
  public totalPages = 0; // Total number of pages from the backend
  public totalElements = 0; // Total number of items across all pages
  public itemsPerPageOptions: number[] = [10, 20, 50, 100]; // Options for items per page dropdown

  //================================================================
  // Forms
  //================================================================
  public selectedItems = new Set<string | number>(); // Set to store IDs of selected items
  public selectAll = false; // Flag for "select all" checkbox

  //================================================================
  // Data & List Properties
  //================================================================
  public sortField = 'id'; // Default field to sort by

  //================================================================
  // Pagination
  public sortDirection: 'asc' | 'desc' = 'desc'; // Default sort direction
  //================================================================
  @Input() modalRef?: any; // Reference to a modal instance if the component is opened in a modal
  // The service responsible for data fetching. Must be provided by the child component.
  protected abstract service: BaseService;
  //================================================================
  protected fb = inject(FormBuilder);
  protected router = inject(Router);

  //================================================================
  // Selection
  protected route = inject(ActivatedRoute);
  protected translate = inject(TranslateService); // Inject TranslateService

  //================================================================
  // Sorting
  protected languageService = inject(LanguageService); // Inject LanguageService
  public currentLang: string = this.languageService.getCurrentLanguage(); // Current active language

  //================================================================
  // Modal & Dialog
  //================================================================
  protected readonly destroy$ = new Subject<void>();

  //================================================================
  // Lifecycle Hooks

  //================================================================
  constructor() {
    this.searchForm = this.fb.group({}); // Initialize with an empty form group
    this.detailForm = this.fb.group({}); // Initialize with an empty form group
  }

  ngOnInit(): void {
    // Skip initialization on server-side rendering
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.initForms();
    // Only resolve mode and load data if service is provided
    if (this.service) {
      this.resolveModeAndLoadData();
    }
    this.setupLanguageChangeSubscription();
    this.onBrowserInit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Hook called when component initializes in browser environment.
   * Override this for browser-specific initialization.
   */
  protected onBrowserInit(): void {
    // Default: empty implementation
  }

  /**
   * Check if running in browser environment
   */
  protected isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  //================================================================
  // Abstract/Hook Methods for Child Component Implementation
  //================================================================

  /**
   * Executes the search operation.
   * It constructs the request, calls the service, and handles the response,
   * updating pagination and data.
   */
  public search(): void {
    if (!this.service) return; // Skip if service not provided
    if (this.loading) return;
    this.loading = true;

    const request = this.onBeforeSearch(this.searchForm.value);
    // Add sorting parameters to the request
    const sortParam = `${this.sortField},${this.sortDirection}`;
    // Assuming the backend accepts sort as a query parameter
    // You might need to adjust this based on your backend's API contract
    const searchRequest = { ...request, sort: sortParam };

    this.service
      .search(searchRequest, this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.items = res.data.content as T[];
            this.totalPages = res.data.totalPages;
            this.totalElements = res.data.totalElements;
            this.onAfterSearch(res);
          } else {
            this.items = [];
            this.totalElements = 0;
            // this.notificationService.warn(res.message || 'No data found.');
          }
          this.clearSelection(); // Clear selection after each search
        },
        error: (err) => {
          this.loading = false;
          this.items = [];
          console.error('Search failed:', err);
          // this.notificationService.error('Failed to load data.');
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  /**
   * Handles form submission for both create and update operations.
   * Validates the form, calls the appropriate service method, and handles response.
   */
  public submit(): void {
    if (this.detailForm.invalid) {
      this.detailForm.markAllAsTouched(); // Mark all fields to show validation errors
      // this.notificationService.error('Please correct the form errors.');
      return;
    }
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const formValue = this.onBeforeSubmit(this.detailForm.value);
    const action$ =
      this.isEditMode && this.currentId
        ? this.service.update(this.currentId, formValue)
        : this.service.create(formValue);

    action$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.onAfterSubmit(res);
        if (res.success) {
          // this.notificationService.success(res.message || 'Operation successful!');
          if (this.modalRef) {
            this.modalRef.close(res.data); // Close modal on success, passing data
          } else {
            this.router.navigate(['..'], { relativeTo: this.route }); // Navigate back to list
          }
        } else {
          // this.notificationService.error(res.message || 'Operation failed!');
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Submission failed:', err);
        // this.notificationService.error('An error occurred during submission.');
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  /**
   * Deletes a single item by its ID.
   * @param id The ID of the item to delete.
   */
  public deleteItem(id: string | number): void {
    // Implement a confirmation dialog here before proceeding
    // this.confirmationService.confirm('Are you sure you want to delete this item?').then(() => {
    this.service
      .deleteById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            // this.notificationService.success(res.message || 'Item deleted successfully!');
            this.search(); // Refresh the list after deletion
          } else {
            // this.notificationService.error(res.message || 'Failed to delete item!');
          }
        },
        error: (err) => {
          console.error('Delete failed:', err);
          // this.notificationService.error('An error occurred during deletion.');
        },
      });
    // });
  }

  /**
   * Deletes all selected items.
   * This method assumes a batch delete endpoint or individual calls.
   */
  public deleteSelectedItems(): void {
    if (this.selectedItems.size === 0) {
      // this.notificationService.warn('No items selected for deletion.');
      return;
    }
    // Implement a confirmation dialog here
    // this.confirmationService.confirm('Are you sure you want to delete selected items?').then(() => {
    // Example for individual deletion (less efficient for many items)
    const deleteObservables = Array.from(this.selectedItems).map((id) =>
      this.service.deleteById(id),
    );
    // You might want to use forkJoin or a dedicated batch delete endpoint
    // forkJoin(deleteObservables).pipe(takeUntil(this.destroy$)).subscribe({
    //   next: () => {
    //     this.notificationService.success('Selected items deleted successfully!');
    //     this.search();
    //   },
    //   error: (err) => {
    //     this.notificationService.error('Failed to delete selected items.');
    //     console.error('Batch delete failed:', err);
    //   }
    // });
    console.warn('Batch delete logic needs to be implemented based on backend API.');
    // });
  }

  /** Resets the search form and re-executes the search. */
  public resetSearch(): void {
    this.searchForm.reset();
    this.currentPage = 0;
    this.search();
  }

  /** Handles page change events from a pagination component. */
  public onPageChange(page: number): void {
    this.currentPage = page;
    this.search();
  }

  /** Handles changes in the number of items per page. */
  public onItemsPerPageChange(size: number): void {
    this.itemsPerPage = size;
    this.currentPage = 0; // Reset to the first page
    this.search();
  }

  /** Toggles the sort direction for a given field and re-searches. */
  public onSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.search();
  }

  /** Toggles the selection state of a single item. */
  public toggleItemSelection(id: string | number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    isChecked ? this.selectedItems.add(id) : this.selectedItems.delete(id);
    this.updateSelectAllState();
  }

  //================================================================
  // Core Logic Methods
  //================================================================

  /** Toggles the selection state of all visible items. */
  public toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.selectedItems.clear();
    if (this.selectAll) {
      this.items.forEach((item) => this.selectedItems.add(item.id));
    }
  }

  /** Clears all selections. */
  public clearSelection(): void {
    this.selectedItems.clear();
    this.selectAll = false;
  }

  /** Closes the current modal or navigates back. */
  public close(): void {
    if (this.modalRef) {
      this.modalRef.dismiss(); // Dismiss modal
    } else {
      this.router.navigate(['..'], { relativeTo: this.route }); // Navigate up one level
    }
  }

  /**
   * Initializes both searchForm and detailForm.
   * Child components MUST implement this to define their specific form fields.
   */
  protected abstract initForms(): void;

  /**
   * Hook called before the search request is made.
   * Useful for transforming search form values (e.g., date formatting).
   * @param formValue The raw value from the search form.
   * @returns The processed request object to be sent to the service.
   */
  protected onBeforeSearch(formValue: any): any {
    return formValue; // Default: returns the form value as is
  }

  /**
   * Hook called after a successful search response.
   * Useful for additional data processing or UI updates after the list is loaded.
   * @param response The BaseResponse containing the Page of entities.
   */
  protected onAfterSearch(response: BaseResponse<Page<T>>): void {
    // Default: empty implementation
  }

  /**
   * Hook called before loading entity details.
   * @param id The ID of the entity to load.
   */
  protected onBeforeLoadDetail(id: string | number): void {
    // Default: empty implementation
  }

  //================================================================
  // UI Helper Methods (Pagination, Sorting, Selection)
  //================================================================

  /**
   * Hook called after successfully loading entity details.
   * Useful for additional data processing or UI updates after a single entity is loaded.
   * @param response The BaseResponse containing the entity.
   */
  protected onAfterLoadDetail(response: BaseResponse<T>): void {
    // Default: empty implementation
  }

  /**
   * Hook called before submitting the detail form (create/update).
   * Useful for transforming form values (e.g., removing disabled fields).
   * @param formValue The raw value from the detail form.
   * @returns The processed request object to be sent to the service.
   */
  protected onBeforeSubmit(formValue: any): any {
    return formValue; // Default: returns the form value as is
  }

  /**
   * Hook called after a successful form submission (create/update).
   * Useful for displaying success messages or navigating.
   * @param response The BaseResponse containing the created/updated entity.
   */
  protected onAfterSubmit(response: BaseResponse<T>): void {
    // Default: empty implementation
  }

  /**
   * Hook called before the language change reload process starts.
   * Child components can override this to perform actions before reloading data.
   */
  protected onBeforeLanguageReload(): void {
    // Default: empty implementation
  }

  /**
   * Hook called after the language change reload process completes.
   * Child components can override this to perform actions after reloading data.
   */
  protected onAfterLanguageReload(): void {
    // Default: empty implementation
  }

  /**
   * Triggers a reload of component data when the language changes.
   * Child components can override `onBeforeLanguageReload` and `onAfterLanguageReload`
   * to customize behavior.
   */
  protected reloadForLanguage(): void {
    this.onBeforeLanguageReload();
    // Re-fetch data or re-initialize forms if needed
    if (this.isEditMode && this.currentId) {
      // Reload detail data if in edit mode
      this.service
        .getDetail(this.currentId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response) => {
          if (response.success && response.data) {
            this.detailForm.patchValue(response.data);
          }
        });
    } else {
      // Re-run search for list pages
      this.search();
    }
    this.onAfterLanguageReload();
  }

  /**
   * Determines if the component is in 'edit' or 'new' mode based on route params
   * and loads the appropriate data.
   */
  protected resolveModeAndLoadData(): void {
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        tap((params) => {
          const id = params.get('id');
          this.currentId = id;
          this.isEditMode = !!id;
          if (this.isEditMode) {
            this.onBeforeLoadDetail(id!);
          }
        }),
        switchMap((params) => {
          if (this.isEditMode && this.currentId) {
            return this.service.getDetail(this.currentId);
          }
          // If not in edit mode, or no ID, perform a default search.
          // This assumes list pages will always call search on init.
          // Detail pages without an ID will just show an empty form.
          this.search();
          return of(null); // Return an observable of null to complete the stream
        }),
      )
      .subscribe((response) => {
        if (response && response.success && response.data) {
          this.detailForm.patchValue(response.data);
          this.onAfterLoadDetail(response);
        } else if (response && !response.success) {
          // Handle error if detail fetch failed
          console.error('Failed to load detail:', response.message);
          // this.notificationService.error(response.message);
        }
      });
  }

  /**
   * Sets up a subscription to listen for language changes and triggers a reload.
   */
  private setupLanguageChangeSubscription(): void {
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.currentLang = this.languageService.getCurrentLanguage();
      this.reloadForLanguage();
    });
  }

  /** Updates the "select all" checkbox state based on individual item selections. */
  private updateSelectAllState(): void {
    this.selectAll =
      this.items.length > 0 && this.items.every((item) => this.selectedItems.has(item.id));
  }
}
