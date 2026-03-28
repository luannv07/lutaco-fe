import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { SHARED_IMPORTS } from '../base-imports'; // Import SHARED_IMPORTS

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [...SHARED_IMPORTS], // Use SHARED_IMPORTS
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent {
  @Input() label: string = '';
  @Input() type: 'text' | 'password' | 'email' | 'number' | 'search' = 'text';
  @Input() value: string | number = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() customClass: string = '';

  @Input() prefixIcon: IconDefinition | string = '';
  @Input() suffixIcon: IconDefinition | string = '';

  @Output() valueChange = new EventEmitter<string | number>();
  @Output() focusEvent = new EventEmitter<FocusEvent>();
  @Output() blurEvent = new EventEmitter<FocusEvent>();
  @Output() inputEvent = new EventEmitter<Event>();

  get isPrefixFontAwesomeIcon(): boolean {
    return typeof this.prefixIcon !== 'string' && this.prefixIcon !== null && this.prefixIcon !== undefined;
  }

  get isSuffixFontAwesomeIcon(): boolean {
    return typeof this.suffixIcon !== 'string' && this.suffixIcon !== null && this.suffixIcon !== undefined;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.inputEvent.emit(event);
    this.valueChange.emit(this.value);
  }

  onFocus(event: FocusEvent): void {
    this.focusEvent.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.blurEvent.emit(event);
  }

  get inputClasses(): string[] {
    let classes: string[] = [
      'block', 'w-full', 'px-3', 'py-2', 'border', 'rounded-md', 'shadow-sm',
      'focus:outline-none', 'focus:ring-blue-500', 'focus:border-blue-500',
      'sm:text-sm', 'transition-all', 'duration-200', 'ease-in-out'
    ];

    if (this.errorMessage) {
      classes.push('border-red-500');
    } else {
      classes.push('border-gray-300');
    }

    if (this.disabled || this.readonly) {
      classes.push('bg-gray-100', 'cursor-not-allowed');
    }

    if (this.prefixIcon) {
      classes.push('pl-10');
    }
    if (this.suffixIcon) {
      classes.push('pr-10');
    }

    if (this.customClass) {
      classes.push(this.customClass);
    }

    return classes;
  }

  get wrapperClasses(): string[] {
    let classes: string[] = [
      'relative', 'flex', 'items-center', 'rounded-md', 'shadow-sm'
    ];
    return classes;
  }

  get iconWrapperClasses(): string[] {
    return ['absolute', 'inset-y-0', 'flex', 'items-center', 'pointer-events-none'];
  }
}
