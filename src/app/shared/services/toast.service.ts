import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { ToastPosition, ToastType } from '../components/toast/toast.component';
import { TranslateService } from '@ngx-translate/core';

export interface Toast {
  id: string;
  title?: string; // Make title optional
  message: string;
  type: ToastType;
  position: ToastPosition;
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  private translateService: TranslateService = inject(TranslateService);
  toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  show(
    message: string,
    type: ToastType = 'info',
    title?: string, // Make title optional
    position: ToastPosition = 'top-right',
    duration: number = 3000,
  ): void {
    const id = this.generateId();
    // Use default title if not provided
    const finalTitle = title !== undefined ? title : this.getDefaultTitle(type);
    const newToast: Toast = { id, title: finalTitle, message, type, position, duration };

    this.toastsSubject.next([...this.toastsSubject.value, newToast]);

    if (duration > 0) {
      timer(duration)
        .pipe(take(1))
        .subscribe(() => this.remove(id));
    }
  }

  remove(id: string): void {
    this.toastsSubject.next(this.toastsSubject.value.filter((toast) => toast.id !== id));
  }

  success(
    arg1: string, // Can be message or title
    arg2?: string, // Can be message if arg1 is title, or undefined if arg1 is message
    position: ToastPosition = 'top-right',
    duration: number = 3000,
  ): void {
    let title: string | undefined;
    let message: string;

    if (arg2 === undefined) {
      message = arg1;
      title = this.translateService.instant('common.ui.toast.success');
    } else {
      title = arg1;
      message = arg2;
    }
    this.show(message, 'success', title, position, duration);
  }

  warning(
    arg1: string,
    arg2?: string,
    position: ToastPosition = 'top-right',
    duration: number = 3000,
  ): void {
    let title: string | undefined;
    let message: string;

    if (arg2 === undefined) {
      message = arg1;
      title = this.translateService.instant('common.ui.toast.warn');
    } else {
      title = arg1;
      message = arg2;
    }
    this.show(message, 'warning', title, position, duration);
  }

  error(
    arg1: string,
    arg2?: string,
    position: ToastPosition = 'top-right',
    duration: number = 3000,
  ): void {
    let title: string | undefined;
    let message: string;

    if (arg2 === undefined) {
      message = arg1;
      title = this.translateService.instant('common.ui.toast.error');
    } else {
      title = arg1;
      message = arg2;
    }
    this.show(message, 'error', title, position, duration);
  }

  info(
    arg1: string,
    arg2?: string,
    position: ToastPosition = 'top-right',
    duration: number = 3000,
  ): void {
    let title: string | undefined;
    let message: string;

    if (arg2 === undefined) {
      message = arg1;
      title = this.translateService.instant('common.ui.toast.info');
    } else {
      title = arg1;
      message = arg2;
    }
    this.show(message, 'info', title, position, duration);
  }

  private getDefaultTitle(type: ToastType): string | undefined {
    switch (type) {
      case 'success':
        return this.translateService.instant('common.ui.toast.success');
      case 'warning':
        return this.translateService.instant('common.ui.toast.warn');
      case 'error':
        return this.translateService.instant('common.ui.toast.error');
      case 'info':
        return this.translateService.instant('common.ui.toast.info');
      default:
        return undefined;
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
