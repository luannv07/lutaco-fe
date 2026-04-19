import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

export interface ComboboxOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-combobox',
  imports: [CommonModule],
  templateUrl: './combobox.component.html',
  styleUrl: './combobox.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
  animations: [
    trigger('panelAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-4px) scaleY(0.95)' }),
        animate(
          '150ms cubic-bezier(0.16, 1, 0.3, 1)',
          style({ opacity: 1, transform: 'translateY(0) scaleY(1)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '100ms cubic-bezier(0.5, 0, 0.75, 0)',
          style({ opacity: 0, transform: 'translateY(-4px) scaleY(0.95)' }),
        ),
      ]),
    ]),
  ],
})
export class ComboboxComponent implements OnChanges {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() value = '';
  @Input() options: ComboboxOption[] = [];
  @Input() disabled = false;
  @Input() required = false;
  @Input() id = '';
  @Input() name = '';
  @Input() customClass = '';
  @Input() allowCustomValue = true;

  @Output() valueChange = new EventEmitter<string>();
  @Output() focusEvent = new EventEmitter<FocusEvent>();
  @Output() blurEvent = new EventEmitter<FocusEvent>();

  protected readonly elementRef = inject(ElementRef<HTMLElement>);
  protected isOpen = false;
  protected query = '';
  protected highlightedIndex = -1;
  private readonly generatedId = `combobox-${Math.random().toString(36).slice(2, 9)}`;

  protected get inputId(): string {
    return this.id || this.generatedId;
  }

  protected get filteredOptions(): ComboboxOption[] {
    const keyword = this.query.trim().toLowerCase();
    if (!keyword) {
      return this.options;
    }

    return this.options.filter((option) => option.label.toLowerCase().includes(keyword));
  }

  protected get inputClasses(): string[] {
    const classes = [
      'h-10',
      'w-full',
      'rounded-lg',
      'border',
      'border-slate-300',
      'bg-white',
      'px-3',
      'pr-10',
      'text-slate-700',
      'transition-colors',
      'duration-150',
      'ease-out',
      'focus:border-indigo-500',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-indigo-500/20',
      'disabled:cursor-not-allowed',
      'disabled:opacity-60',
      'disabled:bg-slate-50',
    ];

    if (this.customClass) {
      classes.push(this.customClass);
    }

    return classes;
  }

  protected onFocus(event: FocusEvent): void {
    if (this.disabled) {
      return;
    }

    this.focusEvent.emit(event);
    this.query = '';
    this.openPanel();
  }

  protected onBlur(event: FocusEvent): void {
    this.blurEvent.emit(event);

    if (!this.isOpen) {
      this.syncQueryFromValue();
      return;
    }

    const nextTarget = event.relatedTarget as Node | null;
    if (nextTarget && this.elementRef.nativeElement.contains(nextTarget)) {
      return;
    }

    this.closePanel();
    this.commitRawQuery();
  }

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query = value;

    if (!this.isOpen) {
      this.openPanel();
    }

    if (this.allowCustomValue) {
      this.valueChange.emit(value);
    }
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!this.isOpen) {
        this.openPanel();
        return;
      }
      this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.filteredOptions.length - 1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
      return;
    }

    if (event.key === 'Enter') {
      if (this.isOpen && this.highlightedIndex >= 0 && this.filteredOptions[this.highlightedIndex]) {
        event.preventDefault();
        this.selectOption(this.filteredOptions[this.highlightedIndex]);
        return;
      }
      if (this.allowCustomValue) {
        this.commitRawQuery();
      } else {
        this.syncQueryFromValue();
      }
      this.closePanel();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.closePanel();
      this.syncQueryFromValue();
    }
  }

  protected onOptionMouseDown(event: MouseEvent, option: ComboboxOption): void {
    event.preventDefault();
    this.selectOption(option);
  }

  protected onDocumentClick(event: Event): void {
    if (!this.isOpen) {
      return;
    }

    const target = event.target as Node | null;
    if (target && this.elementRef.nativeElement.contains(target)) {
      return;
    }

    if (this.allowCustomValue) {
      this.commitRawQuery();
    } else {
      this.syncQueryFromValue();
    }
    this.closePanel();
  }

  protected togglePanel(): void {
    if (this.disabled) {
      return;
    }

    if (this.isOpen) {
      this.commitRawQuery();
      this.closePanel();
      return;
    }

    this.openPanel();
  }

  protected clearValue(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.query = '';
    this.value = '';
    this.valueChange.emit('');
    this.openPanel();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] || changes['options']) {
      this.syncQueryFromValue();
    }
  }

  private openPanel(): void {
    this.isOpen = true;
    this.highlightedIndex = this.filteredOptions.length > 0 ? 0 : -1;
  }

  private closePanel(): void {
    this.isOpen = false;
    this.highlightedIndex = -1;
  }

  private selectOption(option: ComboboxOption): void {
    this.value = option.value;
    this.query = option.label;
    this.valueChange.emit(option.value);
    this.closePanel();
  }

  private commitRawQuery(): void {
    const exactMatch = this.options.find(
      (option) => option.label.toLowerCase() === this.query.trim().toLowerCase(),
    );

    if (exactMatch) {
      this.value = exactMatch.value;
      this.query = exactMatch.label;
      this.valueChange.emit(exactMatch.value);
      return;
    }

    if (!this.allowCustomValue) {
      this.syncQueryFromValue();
      return;
    }

    this.value = this.query.trim();
    this.valueChange.emit(this.value);
  }

  private syncQueryFromValue(): void {
    this.query = this.getLabelByValue(this.value);
  }

  protected getLabelByValue(value: string): string {
    const matched = this.options.find((option) => option.value === value);
    return matched ? matched.label : value;
  }
}
