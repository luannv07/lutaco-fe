import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('badgeAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'scale(0.8)',
        }),
      ),
      transition('void => *', [
        animate(
          '150ms ease-out',
          style({
            opacity: 1,
            transform: 'scale(1)',
          }),
        ),
      ]),
      transition('* => void', [
        animate(
          '100ms ease-in',
          style({
            opacity: 0,
            transform: 'scale(0.8)',
          }),
        ),
      ]),
    ]),
  ],
})
export class BadgeComponent {
  @Input() label: string = '';
  @Input() type: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' = 'neutral';
  @Input() customClass: string = '';

  get badgeClasses(): string[] {
    let classes: string[] = [
      'inline-flex',
      'items-center',
      'px-2.5',
      'py-0.5',
      'rounded-full',
      'text-xs',
      'font-medium', // Base styling
    ];

    switch (this.type) {
      case 'primary':
        classes.push('bg-indigo-50', 'text-indigo-700'); // Changed from 100 to 50, text to 700
        break;
      case 'success':
        classes.push('bg-emerald-50', 'text-emerald-700'); // Changed from 100 to 50, text to 700
        break;
      case 'warning':
        classes.push('bg-amber-50', 'text-amber-700'); // Changed from 100 to 50, text to 700
        break;
      case 'danger':
        classes.push('bg-red-50', 'text-red-700'); // Changed from 100 to 50, text to 700
        break;
      case 'neutral':
      default:
        classes.push('bg-slate-50', 'text-slate-700'); // Changed from 100 to 50, text to 700
        break;
    }

    if (this.customClass) {
      classes.push(this.customClass);
    }

    return classes;
  }
}
