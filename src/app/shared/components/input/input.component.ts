import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations'; // Import animation modules

@Component({
  selector: 'app-input',

  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  animations: [
    // Add animations property
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
export class InputComponent implements AfterViewInit {
  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;

  @Input() label: string = '';
  @Input() type: 'text' | 'password' | 'email' | 'number' | 'search' = 'text';
  @Input() value: string | number = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() customClass: string = '';
  @Input() autoFocus: boolean = false;

  @Input() prefixIconClass: string = '';
  @Input() suffixIconClass: string = '';

  @Output() valueChange = new EventEmitter<string | number>();
  @Output() focusEvent = new EventEmitter<FocusEvent>();
  @Output() blurEvent = new EventEmitter<FocusEvent>();
  @Output() inputEvent = new EventEmitter<Event>();

  get inputClasses(): string[] {
    let classes: string[] = [
      'block',
      'w-full',
      'h-10', // Default height (md)
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
      'focus:border-indigo-500', // Focus: border-indigo-500 ring-2 ring-indigo-500/20
      'transition-colors',
      'duration-150',
      'ease-out', // Transition: border-color 150ms, box-shadow 150ms
      'placeholder-slate-400',
    ];

    if (this.errorMessage) {
      classes.push('border-red-500', 'ring-2', 'ring-red-500/15'); // Error: border-red-500 ring-2 ring-red-500/15
    } else {
      classes.push('border-slate-300', 'hover:border-slate-400'); // Default & Hover
    }

    if (this.disabled || this.readonly) {
      classes.push('bg-slate-50', 'text-slate-400', 'cursor-not-allowed', 'opacity-60'); // Disabled: bg-slate-50 text-slate-400 cursor-not-allowed opacity-60
    }

    // Adjust padding for icons
    if (this.prefixIconClass) {
      classes.push('pl-10');
    }
    if (this.suffixIconClass) {
      classes.push('pr-10');
    }

    if (this.customClass) {
      classes.push(this.customClass);
    }

    return classes;
  }

  get wrapperClasses(): string[] {
    return ['relative', 'flex', 'items-center'];
  }

  get iconWrapperClasses(): string[] {
    return [
      'absolute',
      'inset-y-0',
      'flex',
      'items-center',
      'pointer-events-none',
      'text-slate-400',
      'pl-3',
    ];
  }

  get suffixIconWrapperClasses(): string[] {
    return [
      'absolute',
      'inset-y-0',
      'right-0',
      'flex',
      'items-center',
      'pointer-events-none',
      'text-slate-400',
      'pr-3',
    ];
  }

  get labelClasses(): string[] {
    return ['text-sm', 'font-medium', 'text-slate-700', 'mb-1.5', 'block']; // Label: mb-1.5 (6px)
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

  // fix loi auto focus
  ngAfterViewInit() {
    if (this.autoFocus) {
      setTimeout(() => {
        this.inputEl?.nativeElement?.focus();
      });
    }
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
}
