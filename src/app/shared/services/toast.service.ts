import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { ToastPosition, ToastType } from '../components/toast/toast.component';

export interface Toast {
  id: string;
  title: string;
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
  toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  show(
    title: string,
    message: string,
    type: ToastType = 'info',
    position: ToastPosition = 'top-right',
    duration: number = 3000,
  ): void {
    const id = this.generateId();
    const newToast: Toast = { id, title, message, type, position, duration };

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
    title: string,
    message: string,
    position: ToastPosition = 'top-right',
    duration: number = 3000,
  ): void {
    this.show(title, message, 'success', position, duration);
  }

  warning(
    title: string,
    message: string,
    position: ToastPosition = 'top-right',
    duration: number = 3000,
  ): void {
    this.show(title, message, 'warning', position, duration);
  }

  error(
    title: string,
    message: string,
    position: ToastPosition = 'top-right',
    duration: number = 3000,
  ): void {
    this.show(title, message, 'error', position, duration);
  }

  info(
    title: string,
    message: string,
    position: ToastPosition = 'top-right',
    duration: number = 3000,
  ): void {
    this.show(title, message, 'info', position, duration);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
