export interface VinputProps {
  value: string;
  onChangeWhenReadOnly: (text: string) => void;
  onChangeWhenEditable: (text: string) => void;
  readOnly: boolean;
}
