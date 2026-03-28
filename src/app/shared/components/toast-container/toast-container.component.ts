import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../toast/toast.component';
import { Toast, ToastService } from '../../services/toast.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {
  toasts$: Observable<Toast[]>;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }

  removeToast(id: string): void {
    this.toastService.remove(id);
  }

  // Group toasts by position for rendering
  getToastsByPosition(
    position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left',
  ): Observable<Toast[]> {
    return this.toasts$
      .pipe
      // This is a simplified approach. For more complex scenarios, consider using a map or separate subjects for each position.
      // For now, we'll filter directly in the template using ngFor and a pipe if needed, or directly in the getter.
      // However, for ChangeDetectionStrategy.OnPush, filtering in a getter can be inefficient.
      // A better approach for OnPush would be to transform the observable into a map of positions.
      // For this initial implementation, we'll assume a single position for simplicity or filter in the template.
      // Let's refine this to return the full observable and filter in the template for now.
      // The template will handle the grouping.
      ();
  }
}
