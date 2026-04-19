import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  private readonly platformId = inject(PLATFORM_ID);

  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() customClass: string = '';
  @Input() closeOnOverlayClick: boolean = true;
  @Input() closeOnEscape: boolean = true;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'lg';
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
      'overflow-y-auto',
      'bg-slate-900/60',
      'backdrop-blur-sm', // Backdrop color and blur
      'p-3',
      'sm:p-4',
      'md:p-6',
      'modal-overlay',
    ];
  }

  get modalContentClasses(): string[] {
    let classes: string[] = [
      'bg-white',
      'rounded-xl',
      'shadow-2xl',
      'border',
      'border-slate-100',
      'w-full', // Rounded, shadow, full width
      'max-h-[calc(100vh-1.5rem)]',
      'md:max-h-[calc(100vh-3rem)]',
      'flex',
      'flex-col',
      'overflow-visible',
    ];

    // Max-width based on size input
    switch (this.size) {
      case 'sm':
        classes.push('max-w-full', 'sm:max-w-sm'); // 384px
        break;
      case 'md':
        classes.push('max-w-full', 'sm:max-w-lg');
        break;
      case 'lg':
        classes.push('max-w-full', 'sm:max-w-2xl');
        break;
      case 'xl':
        classes.push('max-w-full', 'sm:max-w-4xl');
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
    return [
      'flex',
      'justify-between',
      'items-center',
      'gap-3',
      'px-4',
      'sm:px-6',
      'pt-4',
      'sm:pt-6',
      'pb-3',
      'sm:pb-4',
      'shrink-0',
    ];
  }

  get modalTitleClasses(): string[] {
    return ['text-lg', 'sm:text-xl', 'font-semibold', 'text-slate-800'];
  }

  get modalBodyClasses(): string[] {
    return [
      'px-4',
      'sm:px-6',
      'py-6',
      'sm:py-7',
      'overflow-visible',
      'flex-1',
      'min-h-0',
      'space-y-5',
    ];
  }

  get modalFooterClasses(): string[] {
    return [
      'flex',
      'flex-col-reverse',
      'sm:flex-row',
      'sm:flex-wrap',
      'justify-end',
      'items-stretch',
      'sm:items-center',
      'gap-3',
      'sm:gap-3',
      'px-4',
      'sm:px-6',
      'pb-4',
      'sm:pb-6',
      'pt-4',
      'border-t',
      'border-slate-100',
      '[&>*]:w-full',
      'sm:[&>*]:w-auto',
      '[&>[modal-footer]]:w-full',
      '[&>[modal-footer]]:flex',
      '[&>[modal-footer]]:flex-col-reverse',
      '[&>[modal-footer]]:items-stretch',
      '[&>[modal-footer]]:gap-3',
      'sm:[&>[modal-footer]]:flex-row',
      'sm:[&>[modal-footer]]:justify-end',
      'sm:[&>[modal-footer]]:items-center',
      'sm:[&>[modal-footer]]:gap-3',
      '[&>[modal-footer]>*]:w-full',
      'sm:[&>[modal-footer]>*]:w-auto',
      'shrink-0',
    ];
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      this.syncBodyScrollLock();
    }
  }

  ngOnDestroy(): void {
    this.toggleBodyScrollLock(false);
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

  private syncBodyScrollLock(): void {
    this.toggleBodyScrollLock(this.isOpen);
  }

  private toggleBodyScrollLock(shouldLock: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    document.body.classList.toggle('overflow-hidden', shouldLock);
  }
}
