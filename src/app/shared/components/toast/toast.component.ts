import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type ToastType = 'success' | 'warning' | 'error' | 'info';
@Component({
  selector: 'app-toast',

  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate3d({{ offsetX }}, 0, 0) scale(0.96)' }),
        animate(
          '280ms cubic-bezier(0.16, 1, 0.3, 1)',
          style({ opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' }),
        ),
      ], { params: { offsetX: '16px' } }),
      transition(':leave', [
        animate(
          '180ms cubic-bezier(0.4, 0, 1, 1)',
          style({ opacity: 0, transform: 'translate3d({{ offsetX }}, 0, 0) scale(0.98)' }),
        ),
      ], { params: { offsetX: '16px' } }),
    ]),
  ],
})
export class ToastComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() type: ToastType = 'info';
  @Input() duration: number = 3000;
  @Input() position: ToastPosition = 'top-right';
  @Output() close = new EventEmitter<void>();
  get toastClasses(): string[] {
    const classes: string[] = [
      'p-4',
      'rounded-lg',
      'shadow-lg',
      'flex',
      'items-start',
      'space-x-3',
      'border-l-4',
    ];
    switch (this.type) {
      case 'success':
        classes.push('bg-emerald-50', 'border-emerald-500', 'text-emerald-800');
        break;
      case 'warning':
        classes.push('bg-amber-50', 'border-amber-500', 'text-amber-800');
        break;
      case 'error':
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
      case 'error':
        return 'fa-solid fa-circle-xmark';
      case 'info':
        return 'fa-solid fa-circle-info';
      default:
        return 'fa-solid fa-circle-info';
    }
  }
  getAnimationParams(): { offsetX: string } {
    if (this.position === 'top-left' || this.position === 'bottom-left') {
      return { offsetX: '-16px' };
    }
    return { offsetX: '16px' };
  }
  onClose(): void {
    this.close.emit();
  }
}
