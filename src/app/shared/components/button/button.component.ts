import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SHARED_IMPORTS } from '../../base-imports'; // Corrected import path

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [...SHARED_IMPORTS], // Use SHARED_IMPORTS
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() label: string = 'Button';
  @Input() buttonType:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'outline'
    | 'flat'
    | 'success'
    | 'warning'
    | 'info' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() customClass: string = '';

  @Input() iconClass: string = ''; // Changed to string for CSS classes
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() fullWidth: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() ariaLabel: string = '';

  @Output() clickEvent = new EventEmitter<Event>();
  @Output() focusEvent = new EventEmitter<FocusEvent>();
  @Output() blurEvent = new EventEmitter<FocusEvent>();

  get buttonClasses(): string[] {
    let classes: string[] = [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-semibold',
      'transition-all',
      'duration-200',
      'ease-out',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-indigo-500',
      'focus-visible:ring-offset-2', // Design System Focus
      'rounded-lg',
      'shadow-sm',
      'whitespace-nowrap', // Design System Roundedness & Shadow
      'active:scale-[0.97]',
      'hover:shadow-md', // Design System Active & Hover Shadow
    ];

    switch (this.size) {
      case 'small':
        classes.push('text-sm', 'h-8', 'px-3', 'gap-2'); // Design System Height: h-8 (32px), gap-2 (8px)
        break;
      case 'large':
        classes.push('text-base', 'h-12', 'px-5', 'gap-2'); // Design System Height: h-12 (48px), gap-2 (8px)
        break;
      default: // medium
        classes.push('text-base', 'h-10', 'px-4', 'gap-2'); // Design System Height: h-10 (40px), gap-2 (8px)
        break;
    }

    switch (this.buttonType) {
      case 'primary':
        classes.push('bg-indigo-600', 'text-white', 'hover:bg-indigo-700'); // Design System Primary Color
        break;
      case 'secondary':
        classes.push(
          'bg-white',
          'border',
          'border-slate-300',
          'text-slate-700',
          'hover:bg-slate-50',
        ); // Design System Secondary Color
        break;
      case 'danger':
        classes.push('bg-red-600', 'text-white', 'hover:bg-red-700'); // Design System Danger Color
        break;
      case 'success':
        classes.push('bg-emerald-500', 'text-white', 'hover:bg-emerald-600'); // Design System Success Color
        break;
      case 'warning':
        classes.push('bg-amber-500', 'text-white', 'hover:bg-amber-600'); // Design System Warning Color
        break;
      case 'info':
        classes.push('bg-sky-500', 'text-white', 'hover:bg-sky-600'); // Design System Info Color
        break;
      case 'outline':
        classes.push(
          'bg-transparent',
          'text-slate-700',
          'border',
          'border-slate-300',
          'hover:bg-slate-50',
        ); // Design System Outline
        break;
      case 'flat':
        classes.push('bg-transparent', 'text-slate-600', 'hover:bg-slate-100', 'shadow-none'); // Design System Flat (ghost variant)
        break;
    }

    if (this.fullWidth) {
      classes.push('w-full');
    }

    if (this.disabled || this.loading) {
      classes.push(
        'opacity-50',
        'cursor-not-allowed',
        'pointer-events-none',
        'shadow-none',
        'active:scale-100',
      ); // Disable active scale when disabled/loading
      classes = classes.filter(
        (cls) => !cls.startsWith('hover:') && !cls.startsWith('focus-visible:'),
      ); // Remove hover/focus effects
    } else {
      classes.push('cursor-pointer');
    }

    if (this.iconClass && this.iconPosition === 'right') {
      classes.push('flex-row-reverse');
    }

    if (this.customClass) {
      classes.push(this.customClass);
    }

    return classes;
  }

  onClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.clickEvent.emit(event);
    }
  }

  onFocus(event: FocusEvent): void {
    this.focusEvent.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.blurEvent.emit(event);
  }
}
