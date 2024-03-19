export interface ToastProps {
  isVisible: boolean;
  label?: string;
  type?: 'check' | 'close' | 'info-outline';
  handleEvent?: () => void;
}
