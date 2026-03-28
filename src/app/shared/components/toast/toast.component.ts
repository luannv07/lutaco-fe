import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type ToastType = 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('toastAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'translateX({{ exitTransform }})', // Use parameter for dynamic exit direction
        }),
        { params: { exitTransform: '100%' } },
      ), // Default exit to right
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'translateX(0)',
        }),
      ),
      transition('void => visible', [
        animate('300ms cubic-bezier(0.16, 1, 0.3, 1)'), // Enter animation
      ]),
      transition('visible => void', [
        animate('200ms ease-in'), // Exit animation
      ]),
    ]),
  ],
})
export class ToastComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() type: ToastType = 'info';
  @Input() duration: number = 3000; // milliseconds, 0 for sticky toast
  @Input() position: ToastPosition = 'top-right'; // Keep position input for animation params

  @Output() close = new EventEmitter<void>();

  get toastClasses(): string[] {
    const classes: string[] = [
      'p-4',
      'rounded-lg',
      'shadow-lg',
      'flex',
      'items-start',
      'space-x-3',
      'border-l-4', // Add border-l-4 for type indication
    ];

    // Type classes
    switch (this.type) {
      case 'success':
        classes.push('bg-emerald-50', 'border-emerald-500', 'text-emerald-800');
        break;
      case 'warning':
        classes.push('bg-amber-50', 'border-amber-500', 'text-amber-800');
        break;
      case 'danger':
        classes.push('bg-red-50', 'border-red-500', 'text-red-800');
        break;
      case 'info':
      default:
        classes.push('bg-indigo-50', 'border-indigo-500', 'text-indigo-800');
        break;
    }

    return classes;
  }

  get closeButtonClasses(): string[] {
    return [
      'text-slate-400',
      'hover:text-slate-600',
      'transition-colors',
      'duration-200',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-indigo-500',
      'rounded-full',
      'p-1',
    ];
  }

  get iconClasses(): string {
    switch (this.type) {
      case 'success':
        return 'fa-solid fa-circle-check';
      case 'warning':
        return 'fa-solid fa-triangle-exclamation';
      case 'danger':
        return 'fa-solid fa-circle-xmark';
      case 'info':
        return 'fa-solid fa-circle-info';
      default:
        return 'fa-solid fa-circle-info';
    }
  }

  getAnimationParams(): { exitTransform: string } {
    if (this.position === 'top-left' || this.position === 'bottom-left') {
      return { exitTransform: '-100%' };
    }
    return { exitTransform: '100%' };
  }

  onClose(): void {
    this.close.emit();
  }
}
