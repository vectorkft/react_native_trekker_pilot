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

const useBeepSound = () => {
  let beep: Sound | null = null;

  try {
    beep = new Sound('scanner_beep.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        Sentry.captureException(error);
        throw error;
      }
    });
  } catch (error) {
    Sentry.captureException(error);
  }

  return beep;
};

export const CameraService = {
  useOnBarCodeRead: (
    getProduct: (value: string) => Promise<void>,
    setIsCameraActive: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    const beep = useBeepSound();
    return {
      onBarCodeRead: async (event: BarCodeReadEvent) => {
        if (event.data) {
          try {
            await getProduct(event.data);
            if (beep) {
              beep.play(success => {
                if (!success) {
                  Sentry.captureMessage('A hang nem játszódott le!', 'warning');
                }
              });
            } else {
              Sentry.captureMessage(
                'A beep hang inicializálása nem volt megfelelő!',
                'warning',
              );
            }
          } finally {
            setIsCameraActive(false);
          }
        }
      },
    };
  },
};
