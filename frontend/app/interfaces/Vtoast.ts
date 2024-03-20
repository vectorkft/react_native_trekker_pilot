import {ToastTypes} from '../enums/types';

export interface ToastProps {
  isVisible: boolean;
  label?: string;
  type?: ToastTypes.success | ToastTypes.close | ToastTypes.info;
  handleEvent?: () => void;
}
