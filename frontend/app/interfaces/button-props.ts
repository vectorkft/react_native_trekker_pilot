export interface ButtonProps {
  color: string;
  label: string;
  enabled: boolean;
  onClick: () => void;
  buttonProps: ButtonProps;
}
