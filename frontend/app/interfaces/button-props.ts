export interface ButtonProps {
  label: string;
  enabled: boolean;
  onClick: () => void;
  isDarkModeOn: boolean;
  optional?: boolean;
}
