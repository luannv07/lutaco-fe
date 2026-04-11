import { ToastPosition, ToastType } from '../components/toast/toast.component';

export interface Toast {
  title: string;
  message: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
  visible?: boolean;
}
