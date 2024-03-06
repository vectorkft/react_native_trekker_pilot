import {BarCodeReadEvent} from 'react-native-camera';

export interface CameraScannerProps {
  onScan: (e: BarCodeReadEvent) => void;
  isCameraActive: boolean;
  onClose: () => void;
}
