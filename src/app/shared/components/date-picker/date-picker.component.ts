import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-picker',
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent {
  @ViewChild('dateInput') dateInput?: ElementRef<HTMLInputElement>;

  @Input() label = '';
  @Input() id = '';
  @Input() name = '';
  @Input() value = '';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() min = '';
  @Input() max = '';
  @Input() customClass = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() focusEvent = new EventEmitter<FocusEvent>();
  @Output() blurEvent = new EventEmitter<FocusEvent>();

  private readonly generatedId = `date-picker-${Math.random().toString(36).slice(2, 9)}`;

  protected get inputId(): string {
    return this.id || this.generatedId;
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

  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.valueChange.emit(this.value);
  }

  protected onFocus(event: FocusEvent): void {
    this.focusEvent.emit(event);
  }

  protected onBlur(event: FocusEvent): void {
    this.blurEvent.emit(event);
  }

  protected openPicker(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.disabled || !this.dateInput?.nativeElement) {
      return;
    }

    const inputElement = this.dateInput.nativeElement;
    inputElement.focus();
    if ('showPicker' in inputElement) {
      inputElement.showPicker();
    }
  }
}
