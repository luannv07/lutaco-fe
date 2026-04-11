import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-textarea',

  imports: [CommonModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.css',
  animations: [
    trigger('errorMessageAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'translateY(-4px)',
        }),
      ),
      transition('void => *', [
        animate(
          '200ms ease-out',
          style({
            opacity: 1,
            transform: 'translateY(0)',
          }),
        ),
      ]),
      transition('* => void', [
        animate(
          '150ms ease-in',
          style({
            opacity: 0,
            transform: 'translateY(-4px)',
          }),
        ),
      ]),
    ]),
  ],
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

  // Internal ID for accessibility if not provided
  _id: string = this.id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

  get textareaClasses(): string[] {
    let classes: string[] = [
      'block',
      'w-full',
      'px-3',
      'py-2',
      'border',
      'rounded-lg',
      'shadow-sm',
      'bg-white',
      'text-slate-700',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-indigo-500/20',
      'focus:border-indigo-500',
      'transition-colors',
      'duration-150',
      'ease-out',
      'resize-y',
      'placeholder-slate-400',
    ];

    if (this.errorMessage) {
      classes.push('border-red-500', 'ring-2', 'ring-red-500/15');
    } else {
      classes.push('border-slate-300', 'hover:border-slate-400');
    }

    if (this.disabled || this.readonly) {
      classes.push('bg-slate-50', 'text-slate-400', 'cursor-not-allowed', 'opacity-60');
    }

    if (this.customClass) {
      classes.push(this.customClass);
    }

    return classes;
  }

  get labelClasses(): string[] {
    return ['text-sm', 'font-medium', 'text-slate-700', 'mb-1.5'];
  }

  get errorTextClasses(): string[] {
    return ['text-sm', 'text-red-600', 'mt-1.5', 'flex', 'items-center', 'gap-1'];
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
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
}
