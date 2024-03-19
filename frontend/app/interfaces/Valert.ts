export type Alert = {
  type: 'error' | 'warning' | 'message';
  title: string;
  message: string;
};
