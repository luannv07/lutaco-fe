import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-checkbox',

  imports: [CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
  animations: [
    trigger('checkmarkAnimation', [
      state('void', style({ opacity: 0, transform: 'scale(0.5)' })),
      state('*', style({ opacity: 1, transform: 'scale(1)' })),
      transition('void => *', [animate('150ms ease-out')]),
      transition('* => void', [animate('100ms ease-in')]),
    ]),
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
export class CheckboxComponent {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() id: string = '';
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() errorMessage: string = '';
  @Input() customClass: string = '';

  @Output() checkedChange = new EventEmitter<boolean>();
  @Output() changeEvent = new EventEmitter<Event>();
  @Output() focusEvent = new EventEmitter<FocusEvent>();
  @Output() blurEvent = new EventEmitter<FocusEvent>();

  // Internal ID for accessibility if not provided
  _id: string = this.id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

  get checkboxContainerClasses(): string[] {
    const classes: string[] = ['flex', 'items-center', 'select-none'];
    if (!this.disabled) {
      classes.push('cursor-pointer');
    }
    return classes;
  }

  get checkboxVisualClasses(): string[] {
    const classes: string[] = [
      'relative',
      'flex',
      'items-center',
      'justify-center',
      'h-4',
      'w-4', // Size
      'rounded', // Roundedness
      'border', // Border
      'transition-all',
      'duration-200',
      'ease-out', // Transitions
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-indigo-500',
      'focus-visible:ring-offset-2', // Focus
    ];

    if (this.checked) {
      classes.push('bg-indigo-600', 'border-indigo-600', 'text-white'); // Checked State
    } else {
      classes.push('bg-white', 'border-slate-300', 'text-transparent'); // Unchecked State
    }

    if (this.disabled) {
      classes.push('opacity-50', 'cursor-not-allowed', 'bg-slate-200'); // Disabled State
    }

    if (this.errorMessage) {
      classes.push('!border-red-500', '!ring-red-500/15'); // Error State
    }

    if (this.customClass) {
      classes.push(this.customClass);
    }
    return classes;
  }

  get labelClasses(): string[] {
    const classes: string[] = [
      'ml-2',
      'text-sm',
      'font-medium',
      'text-slate-700', // Label
    ];
    if (this.disabled) {
      classes.push('text-slate-500');
    }
    if (this.errorMessage) {
      classes.push('text-red-600'); // Error Label
    }
    return classes;
  }

  get errorTextClasses(): string[] {
    return ['text-sm', 'text-red-600', 'mt-1.5', 'flex', 'items-center', 'gap-1'];
  }

  onModelChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.checkedChange.emit(this.checked);
    this.changeEvent.emit(event);
  }

  onFocus(event: FocusEvent): void {
    this.focusEvent.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.blurEvent.emit(event);
  }
}
