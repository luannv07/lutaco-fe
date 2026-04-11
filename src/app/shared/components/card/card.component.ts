import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',

  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  @Input() title: string = '';
  @Input() customClass: string = '';

  get cardClasses(): string[] {
    let classes: string[] = [
      'bg-white',
      'rounded-xl',
      'shadow-sm',
      'p-6', // Base styling updated to rounded-xl and shadow-sm
    ];

    if (this.customClass) {
      classes.push(this.customClass);
    }

    return classes;
  }

  get titleClasses(): string[] {
    return ['text-xl', 'font-semibold', 'text-slate-800', 'mb-4'];
  }
}
