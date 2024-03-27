import {BarCodeReadEvent} from 'react-native-camera';

export interface ScannerProps {
  onScan: (e: BarCodeReadEvent) => void;
  onClose: () => void;
}
