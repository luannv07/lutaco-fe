import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-modal',

  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('modalBackdropAnimation', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', [animate('200ms ease-out')]),
      transition('* => void', [animate('150ms ease-in')]),
    ]),
    trigger('modalPanelAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'scale(0.95) translateY(16px)',
        }),
      ),
      state(
        '*',
        style({
          opacity: 1,
          transform: 'scale(1) translateY(0)',
        }),
      ),
      transition('void => *', [
        animate('250ms cubic-bezier(0.16, 1, 0.3, 1)'), // Enter animation
      ]),
      transition('* => void', [
        animate('150ms ease-in'), // Exit animation
      ]),
    ]),
  ],
})
export class ModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() customClass: string = '';
  @Input() closeOnOverlayClick: boolean = true;
  @Input() closeOnEscape: boolean = true;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md'; // New input for size
  @Input() showFooter: boolean = false; // New input for footer visibility

  @Output() closeEvent = new EventEmitter<void>();
  @Output() primaryAction = new EventEmitter<void>(); // New output for primary action

  get modalContainerClasses(): string[] {
    return [
      'fixed',
      'inset-0',
      'z-[9999]',
      'flex',
      'items-center',
      'justify-center',
      'bg-slate-900/60',
      'backdrop-blur-sm', // Backdrop color and blur
      'modal-overlay',
    ];
  }

  get modalContentClasses(): string[] {
    let classes: string[] = [
      'bg-white',
      'rounded-xl',
      'shadow-2xl',
      'w-full', // Rounded, shadow, full width
    ];

    // Max-width based on size input
    switch (this.size) {
      case 'sm':
        classes.push('max-w-sm'); // 384px
        break;
      case 'md':
        classes.push('max-w-md'); // 512px (default)
        break;
      case 'lg':
        classes.push('max-w-lg'); // 640px
        break;
      case 'xl':
        classes.push('max-w-xl'); // 768px
        break;
      case 'full':
        classes.push('max-w-full', 'h-full', 'rounded-none'); // Full screen, no rounded corners
        break;
    }

    if (this.customClass) {
      classes.push(this.customClass);
    }

    return classes;
  }

  get modalHeaderClasses(): string[] {
    return ['flex', 'justify-between', 'items-center', 'px-6', 'pt-6', 'pb-4']; // Padding header
  }

  get modalTitleClasses(): string[] {
    return ['text-xl', 'font-semibold', 'text-slate-800'];
  }

  get modalBodyClasses(): string[] {
    return ['px-6', 'py-4']; // Padding body
  }

  get modalFooterClasses(): string[] {
    return ['flex', 'justify-end', 'gap-3', 'px-6', 'pb-6', 'pt-2', 'border-t', 'border-slate-100']; // Padding footer, divider
  }

  get closeButtonClasses(): string[] {
    return [
      'text-slate-400',
      'hover:text-slate-600',
      'transition-colors',
      'duration-200',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-indigo-500',
      'focus-visible:ring-offset-2',
      'rounded-full',
      'p-1',
    ];
  }

  onClose(): void {
    this.closeEvent.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (
      this.closeOnOverlayClick &&
      (event.target as HTMLElement).classList.contains('modal-overlay')
    ) {
      this.onClose();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (this.isOpen && this.closeOnEscape) {
      this.onClose();
    }
  }
}
