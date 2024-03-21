import Sound from 'react-native-sound';
import * as Sentry from '@sentry/react-native/dist/js';
import {BarCodeReadEvent} from 'react-native-camera';
import React, {useState} from 'react';
import {useAlert} from '../states/use-alert';

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
  let alternativeBeep: Sound | null = null;

  try {
    beep = new Sound('scanner_beep.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        Sentry.captureException(error);
        throw error;
      }
    });

    alternativeBeep = new Sound(
      'alternative_sound.mp3',
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          Sentry.captureException(error);
          throw error;
        }
      },
    );
  } catch (error) {
    Sentry.captureException(error);
  }

  return {beep, alternativeBeep};
};

export const CameraService = {
  useOnBarCodeRead: (
    getProduct: (value: string) => Promise<void>,
    setIsCameraActive: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    const {setErrorMessage} = useAlert();
    const {beep, alternativeBeep} = useBeepSound();
    return {
      onBarCodeRead: async (event: BarCodeReadEvent) => {
        if (event.data) {
          try {
            await getProduct(event.data);
            if (beep && alternativeBeep) {
              beep.play(success => {
                if (!success) {
                  Sentry.captureMessage('A hang nem játszódott le!', 'warning');
                  alternativeBeep.play();
                }
              });
            } else {
              Sentry.captureMessage(
                'A beep hang inicializálása nem volt megfelelő!',
                'warning',
              );
            }
          } catch (e) {
            Sentry.captureException(e);
            setErrorMessage('Hibás szkennelés kérjük próbálja újra!');
          } finally {
            setIsCameraActive(false);
          }
        }
      },
    };
  },
};
