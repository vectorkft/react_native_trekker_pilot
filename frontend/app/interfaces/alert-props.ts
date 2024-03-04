export type AlertProps = {
  type: 'error' | 'warning' | 'message';
  title: string;
  message: string;
  onClose: () => void;
};
