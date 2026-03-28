import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from './shared/components/button/button.component'; // Import ButtonComponent
import { InputComponent } from './shared/components/input/input.component'; // Import InputComponent
import { CheckboxComponent } from './shared/components/checkbox/checkbox.component'; // Import CheckboxComponent
import { TextareaComponent } from './shared/components/textarea/textarea.component'; // Import TextareaComponent
import { BadgeComponent } from './shared/components/badge/badge.component'; // Import BadgeComponent
import { CardComponent } from './shared/components/card/card.component'; // Import CardComponent
import { SelectComponent } from './shared/components/select/select.component'; // Import SelectComponent
import { ModalComponent } from './shared/components/modal/modal.component'; // Import ModalComponent
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component'; // Import ToastContainerComponent
import { ToastService } from './shared/services/toast.service'; // Import ToastService
import { TableComponent, TableColumn } from './shared/components/table/table.component'; // Import TableComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    // Use SHARED_IMPORTS for common modules
    ButtonComponent, // Import shared components directly
    InputComponent,
    CheckboxComponent,
    TextareaComponent,
    BadgeComponent, // Add BadgeComponent
    CardComponent, // Add CardComponent
    SelectComponent, // Add SelectComponent
    ModalComponent, // Add ModalComponent
    ToastContainerComponent, // Add ToastContainerComponent
    TableComponent, // Add TableComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // Demo signals for ButtonComponent
  isLoading = signal(false);
  // Demo signals for InputComponent
  textInputValue = signal('Initial Value');
  passwordInputValue = signal('');
  emailInputValue = signal('');
  searchInputValue = signal('');
  inputWithError = signal('');
  hasError = signal(false);
  // Demo signals for CheckboxComponent
  rememberMe = signal(false);
  agreeTerms = signal(true);
  toggleCheckboxError = signal(false);
  // Demo signals for TextareaComponent
  commentText = signal('This is a default comment.');
  descriptionText = signal('');
  textareaHasError = signal(false);
  // Demo signals for SelectComponent
  selectedCategory = signal('');
  categoryOptions = [
    { value: 'food', label: 'Food' },
    { value: 'transport', label: 'Transport' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'salary', label: 'Salary' },
    { value: 'investments', label: 'Investments' },
  ];
  selectWithError = signal('');
  selectHasError = signal(false);
  // Demo signals for ModalComponent
  isModalOpen = signal(false);
  // Demo data for TableComponent
  tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'date', label: 'Date', type: 'date', sortable: true },
    { key: 'description', label: 'Description' },
    { key: 'category', label: 'Category' },
    { key: 'amount', label: 'Amount', type: 'currency', align: 'right', sortable: true },
    { key: 'status', label: 'Status', type: 'badge', badgeMap: {
      'completed': 'income',
      'pending': 'pending',
      'cancelled': 'expense'
    }}
  ];

  tableData = [
    { id: 1, date: '2024-03-25', description: 'Groceries', category: 'Food', amount: -50.00, status: 'completed' },
    { id: 2, date: '2024-03-24', description: 'Bus Fare', category: 'Transport', amount: -5.50, status: 'completed' },
    { id: 3, date: '2024-03-23', description: 'Salary', category: 'Income', amount: 2000.00, status: 'completed' },
    { id: 4, date: '2024-03-22', description: 'Dinner with friends', category: 'Food', amount: -35.00, status: 'pending' },
    { id: 5, date: '2024-03-21', description: 'Electricity Bill', category: 'Utilities', amount: -75.00, status: 'completed' },
    { id: 6, date: '2024-03-20', description: 'Rent', category: 'Housing', amount: -1200.00, status: 'completed' },
    { id: 7, date: '2024-03-19', description: 'Internet Bill', category: 'Utilities', amount: -60.00, status: 'pending' },
    { id: 8, date: '2024-03-18', description: 'Coffee', category: 'Food', amount: -4.50, status: 'completed' },
    { id: 9, date: '2024-03-17', description: 'Movie Tickets', category: 'Entertainment', amount: -25.00, status: 'cancelled' },
    { id: 10, date: '2024-03-16', description: 'Gym Membership', category: 'Health', amount: -40.00, status: 'completed' },
    { id: 11, date: '2024-03-15', description: 'Books', category: 'Education', amount: -30.00, status: 'completed' },
    { id: 12, date: '2024-03-14', description: 'Gas', category: 'Transport', amount: -30.00, status: 'completed' },
    { id: 13, date: '2024-03-13', description: 'Lunch', category: 'Food', amount: -12.00, status: 'pending' },
    { id: 14, date: '2024-03-12', description: 'Shopping', category: 'Personal', amount: -80.00, status: 'completed' },
    { id: 15, date: '2024-03-11', description: 'Freelance Payment', category: 'Income', amount: 500.00, status: 'completed' },
    { id: 16, date: '2024-03-10', description: 'Groceries', category: 'Food', amount: -45.00, status: 'completed' },
    { id: 17, date: '2024-03-09', description: 'Taxi', category: 'Transport', amount: -15.00, status: 'completed' },
    { id: 18, date: '2024-03-08', description: 'Bonus', category: 'Income', amount: 100.00, status: 'completed' },
    { id: 19, date: '2024-03-07', description: 'Concert Tickets', category: 'Entertainment', amount: -60.00, status: 'pending' },
    { id: 20, date: '2024-03-06', description: 'Water Bill', category: 'Utilities', amount: -30.00, status: 'completed' },
  ];
  tableCurrentPage = signal(1); // New signal for table current page
  // Khai báo các icon sử dụng chuỗi class CSS (ví dụ: Font Awesome)
  iconSave = 'fa-solid fa-save';
  iconTrash = 'fa-solid fa-trash';
  iconEdit = 'fa-solid fa-edit';
  iconStar = 'fa-solid fa-star';
  iconUser = 'fa-solid fa-user';
  iconLock = 'fa-solid fa-lock';
  iconEnvelope = 'fa-solid fa-envelope';
  iconSearch = 'fa-solid fa-magnifying-glass';
  iconEye = 'fa-solid fa-eye';
  protected readonly title = signal('lutaco-fe');

  constructor(private toastService: ToastService) {
    // Không cần đăng ký icon với FaIconLibrary nữa
  }

  // Button event handlers
  onButtonClick(buttonName: string): void {
    console.log(`${buttonName} button clicked!`);
    // alert(`${buttonName} button clicked!`);

    if (buttonName === 'Toggle Loading') {
      this.isLoading.update((value) => !value);
    }
    if (buttonName === 'Toggle Input Error') {
      this.hasError.update((value) => !value);
    }
    if (buttonName === 'Toggle Checkbox Error') {
      this.toggleCheckboxError.update((value) => !value);
    }
    if (buttonName === 'Toggle Textarea Error') {
      this.textareaHasError.update((value) => !value);
    }
    if (buttonName === 'Toggle Select Error') {
      this.selectHasError.update((value) => !value);
    }
    if (buttonName === 'Open Modal') {
      this.isModalOpen.set(true);
    }
    if (buttonName === 'Show Success Toast') {
      this.toastService.success('Success!', 'Operation completed successfully.');
    }
    if (buttonName === 'Show Warning Toast') {
      this.toastService.warning('Warning!', 'Something might be wrong.');
    }
    if (buttonName === 'Show Danger Toast') {
      this.toastService.danger('Error!', 'An unexpected error occurred.');
    }
    if (buttonName === 'Show Info Toast') {
      this.toastService.info('Information', 'This is an informational message.');
    }
  }

  onButtonFocus(buttonName: string): void {
    console.log(`${buttonName} button focused!`);
  }

  onButtonBlur(buttonName: string): void {
    console.log(`${buttonName} button blurred!`);
  }

  // Input event handlers
  onTextInputChange(value: string | number): void {
    this.textInputValue.set(value.toString());
    console.log('Text Input Value Changed:', value);
  }

  onPasswordInputChange(value: string | number): void {
    this.passwordInputValue.set(value.toString());
    console.log('Password Input Value Changed:', value);
  }

  onEmailInputChange(value: string | number): void {
    this.emailInputValue.set(value.toString());
    console.log('Email Input Value Changed:', value);
  }

  onSearchInputChange(value: string | number): void {
    this.searchInputValue.set(value.toString());
    console.log('Search Input Value Changed:', value);
  }

  onInputWithErrorChange(value: string | number): void {
    this.inputWithError.set(value.toString());
    console.log('Input with Error Value Changed:', value);
    if (value.toString().length > 0) {
      this.hasError.set(false);
    }
  }

  onInputFocus(inputName: string): void {
    console.log(`${inputName} Input Focused!`);
  }

  onInputBlur(inputName: string): void {
    console.log(`${inputName} Input Blurred!`);
  }

  // Checkbox event handlers
  onRememberMeChange(checked: boolean): void {
    this.rememberMe.set(checked);
    console.log('Remember Me:', checked);
  }

  onAgreeTermsChange(checked: boolean): void {
    this.agreeTerms.set(checked);
    console.log('Agree Terms:', checked);
  }

  onCheckboxFocus(checkboxName: string): void {
    console.log(`${checkboxName} Checkbox Focused!`);
  }

  onCheckboxBlur(checkboxName: string): void {
    console.log(`${checkboxName} Checkbox Blurred!`);
  }

  // Textarea event handlers
  onCommentTextChange(value: string): void {
    this.commentText.set(value);
    console.log('Comment Text Changed:', value);
  }

  onDescriptionTextChange(value: string): void {
    this.descriptionText.set(value);
    console.log('Description Text Changed:', value);
    if (value.length > 0) {
      this.textareaHasError.set(false);
    }
  }

  onTextareaFocus(textareaName: string): void {
    console.log(`${textareaName} Textarea Focused!`);
  }

  onTextareaBlur(textareaName: string): void {
    console.log(`${textareaName} Textarea Blurred!`);
  }

  // Select event handlers
  onCategoryChange(value: string): void {
    this.selectedCategory.set(value);
    console.log('Selected Category:', value);
    if (value.length > 0) {
      this.selectHasError.set(false);
    }
  }

  onSelectWithErrorChange(value: string): void {
    this.selectWithError.set(value);
    console.log('Select with Error Value Changed:', value);
    if (value.length > 0) {
      this.selectHasError.set(false);
    }
  }

  onSelectFocus(selectName: string): void {
    console.log(`${selectName} Select Focused!`);
  }

  onSelectBlur(selectName: string): void {
    console.log(`${selectName} Select Blurred!`);
  }

  // Modal event handlers
  onModalClose(): void {
    this.isModalOpen.set(false);
    console.log('Modal closed!');
  }

  // Table event handlers
  onRowClicked(rowData: any): void {
    console.log('Row clicked:', rowData);
    alert(`Row clicked: ${JSON.stringify(rowData)}`);
  }

  onTablePageChange(page: number): void {
    this.tableCurrentPage.set(page);
    console.log('Table page changed to:', page);
  }

  onSelectionChange(selectedRows: any[]): void {
    console.log('Table selection changed:', selectedRows);
  }
}
