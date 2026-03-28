import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSave, faTrash, faEdit, faStar, faUser, faLock, faEnvelope, faSearch, faEye } from '@fortawesome/free-solid-svg-icons';

import { SHARED_IMPORTS } from './shared/base-imports'; // Import SHARED_IMPORTS

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ...SHARED_IMPORTS], // Use SHARED_IMPORTS
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('lutaco-fe');

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

  // Khai báo các icon để sử dụng trong template
  faSave = faSave;
  faTrash = faTrash;
  faEdit = faEdit;
  faStar = faStar;
  faUser = faUser;
  faLock = faLock;
  faEnvelope = faEnvelope;
  faSearch = faSearch;
  faEye = faEye;

  constructor(library: FaIconLibrary) {
    library.addIcons(faSave, faTrash, faEdit, faStar, faUser, faLock, faEnvelope, faSearch, faEye);
  }

  // Button event handlers
  onButtonClick(buttonName: string): void {
    console.log(`${buttonName} button clicked!`);
    alert(`${buttonName} button clicked!`);

    if (buttonName === 'Toggle Loading') {
      this.isLoading.update(value => !value);
    }
    if (buttonName === 'Toggle Input Error') {
      this.hasError.update(value => !value);
    }
    if (buttonName === 'Toggle Checkbox Error') {
      this.toggleCheckboxError.update(value => !value);
    }
    if (buttonName === 'Toggle Textarea Error') {
      this.textareaHasError.update(value => !value);
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
}
