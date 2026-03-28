import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SHARED_IMPORTS } from '../base-imports'; // Import SHARED_IMPORTS

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [...SHARED_IMPORTS], // Use SHARED_IMPORTS
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
})
export class CheckboxComponent {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() id: string = '';
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() customClass: string = '';

  @Output() checkedChange = new EventEmitter<boolean>();
  @Output() changeEvent = new EventEmitter<Event>();
  @Output() focusEvent = new EventEmitter<FocusEvent>();
  @Output() blurEvent = new EventEmitter<FocusEvent>();

  onModelChange(value: boolean): void {
    this.checked = value;
    this.checkedChange.emit(value);
  }

  onChange(event: Event): void {
    this.changeEvent.emit(event);
  }

  onFocus(event: FocusEvent): void {
    this.focusEvent.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.blurEvent.emit(event);
  }

  get checkboxContainerClasses(): string[] {
    const classes: string[] = [
      'flex', 'items-center', 'cursor-pointer', 'select-none'
    ];
    if (this.disabled) {
      classes.push('opacity-50', 'cursor-not-allowed');
    }
    return classes;
  }

  get checkboxInputClasses(): string[] {
    const classes: string[] = [
      'h-4', 'w-4', 'text-blue-600', 'form-checkbox', 'rounded',
      'focus:ring-blue-500', 'border-gray-300', 'transition-colors', 'duration-200', 'ease-in-out'
    ];
    if (this.disabled) {
      classes.push('bg-gray-200', 'cursor-not-allowed');
    }
    if (this.customClass) {
      classes.push(this.customClass);
    }
    return classes;
  }

  get labelClasses(): string[] {
    const classes: string[] = [
      'ml-2', 'text-sm', 'font-medium', 'text-gray-700'
    ];
    if (this.disabled) {
      classes.push('text-gray-500');
    }
    return classes;
  }
}
