import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select',

  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class SelectComponent {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() id: string = '';
  @Input() value: string = '';
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() customClass: string = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() focusEvent = new EventEmitter<FocusEvent>();
  @Output() blurEvent = new EventEmitter<FocusEvent>();

  // Internal ID for accessibility if not provided
  _id: string = this.id || `select-${Math.random().toString(36).substring(2, 9)}`;

  get selectClasses(): string[] {
    let classes: string[] = [
      'block',
      'w-full',
      'h-10', // Default height (md)
      'px-3',
      'py-2',
      'border',
      'rounded-lg',
      'bg-white',
      'text-slate-700',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-indigo-500/20',
      'focus:border-indigo-500', // Focus: border-indigo-500 ring-2 ring-indigo-500/20
      'transition-colors',
      'duration-150',
      'ease-out', // Transition: border-color 150ms, box-shadow 150ms
      'appearance-none', // Remove default select arrow
      'pr-10', // Space for custom arrow
    ];

    if (this.errorMessage) {
      classes.push('border-red-500', 'ring-2', 'ring-red-500/15'); // Error: border-red-500 ring-2 ring-red-500/15
    } else {
      classes.push('border-slate-300', 'hover:border-indigo-300'); // Default & Hover
    }

    if (this.disabled) {
      classes.push('bg-slate-50', 'text-slate-400', 'cursor-not-allowed', 'opacity-60'); // Disabled: bg-slate-50 text-slate-400 cursor-not-allowed opacity-60
    }

    if (this.customClass) {
      classes.push(this.customClass);
    }

    return classes;
  }

  get labelClasses(): string[] {
    return ['text-sm', 'font-medium', 'text-slate-700', 'mb-1.5']; // Label: mb-1.5 (6px)
  }

  get errorTextClasses(): string[] {
    return [
      'text-sm',
      'text-red-600',
      'mt-1.5', // Error message: text-red-600, text-sm, mt-1.5 (6px)
      'flex',
      'items-center',
      'gap-1',
    ];
  }

  get wrapperClasses(): string[] {
    return ['relative'];
  }

  get arrowIconClasses(): string[] {
    return [
      'absolute',
      'right-3',
      'top-1/2',
      '-translate-y-1/2',
      'pointer-events-none',
      'text-slate-400',
      'transition-colors',
      'duration-150',
    ];
  }

  onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.valueChange.emit(this.value);
  }

  onFocus(event: FocusEvent): void {
    this.focusEvent.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.blurEvent.emit(event);
  }
}
