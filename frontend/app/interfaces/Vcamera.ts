import {BarCodeReadEvent} from 'react-native-camera';

export interface ScannerInterface {
  onScan: (e: BarCodeReadEvent) => void;
  onClose: () => void;
}
