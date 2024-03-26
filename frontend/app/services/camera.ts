import Sound from 'react-native-sound';
import * as Sentry from '@sentry/react-native/dist/js';
import {BarCodeReadEvent} from 'react-native-camera';
import React, {useState} from 'react';

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

export const useBeepSound = () => {
  let beep: Sound | null = null;

  try {
    beep = new Sound('scanner_beep.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        throw error;
      }
    });
  } catch (error) {
    Sentry.captureException(error);
  }

  return beep;
};

export const CameraService = {
  useOnBarCodeRead: (handleSubmit: (value: string) => void) => {
    return {
      onBarCodeRead: async (event: BarCodeReadEvent) => {
        if (event.data) {
          handleSubmit(event.data);
        }
      },
    };
  },
};
