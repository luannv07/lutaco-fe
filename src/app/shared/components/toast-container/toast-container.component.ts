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
}
