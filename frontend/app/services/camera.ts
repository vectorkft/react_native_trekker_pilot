import {BarCodeReadEvent} from 'react-native-camera';
import React, {useState} from 'react';
import RNSystemSounds from '@dashdoc/react-native-system-sounds';

export const useCamera = (
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleOnClose = () => {
    setErrorMessage(null);
    setIsCameraActive(false);
  };

  const clickCamera = () => {
    setErrorMessage(null);
    setIsCameraActive(true);
  };

  return {
    isCameraActive,
    handleOnClose,
    clickCamera,
    setIsCameraActive,
  };
};

export const CameraService = {
  useOnBarCodeRead: (handleSubmit: (value: string) => void) => {
    let lastBarCode: string;
    return {
      onBarCodeRead: async (event: BarCodeReadEvent) => {
        if (event.data && event.data !== lastBarCode) {
          lastBarCode = event.data;
          handleSubmit(lastBarCode);
          RNSystemSounds.beep(RNSystemSounds.Beeps.Positive);
        }
      },
    };
  },
};
