import {ToastType} from '../enums/type';

export interface ToastProps {
  isVisible: boolean;
  label?: string;
  type?: ToastType.success | ToastType.close | ToastType.info;
  handleEvent?: () => void;
}
