import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SHARED_IMPORTS } from '../base-imports'; // Import SHARED_IMPORTS

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [...SHARED_IMPORTS], // Use SHARED_IMPORTS
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.css',
})
export class TextareaComponent {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() id: string = '';
  @Input() value: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() rows: number = 3;
  @Input() errorMessage: string = '';
  @Input() customClass: string = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() focusEvent = new EventEmitter<FocusEvent>();
  @Output() blurEvent = new EventEmitter<FocusEvent>();
  @Output() inputEvent = new EventEmitter<Event>();

  onModelChange(value: string): void {
    this.value = value;
    this.valueChange.emit(value);
  }

  onInput(event: Event): void {
    this.inputEvent.emit(event);
  }

  onFocus(event: FocusEvent): void {
    this.focusEvent.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.blurEvent.emit(event);
  }

  get textareaClasses(): string[] {
    let classes: string[] = [
      'block', 'w-full', 'px-3', 'py-2', 'border', 'rounded-md', 'shadow-sm',
      'focus:outline-none', 'focus:ring-blue-500', 'focus:border-blue-500',
      'sm:text-sm', 'transition-all', 'duration-200', 'ease-in-out', 'resize-y'
    ];

    if (this.errorMessage) {
      classes.push('border-red-500');
    } else {
      classes.push('border-gray-300');
    }

    if (this.disabled || this.readonly) {
      classes.push('bg-gray-100', 'cursor-not-allowed');
    }

    if (this.customClass) {
      classes.push(this.customClass);
    }

    return classes;
  }

  get labelClasses(): string[] {
    const classes: string[] = [
      'block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1'
    ];
    if (this.disabled) {
      classes.push('text-gray-500');
    }
    return classes;
  }
}
