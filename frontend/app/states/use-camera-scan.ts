import React, {useCallback, useMemo, useState} from 'react';
import Sound from 'react-native-sound';
import * as Sentry from '@sentry/react-native';
import {BarCodeReadEvent} from 'react-native-camera';

export const useCamera = (
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleOnClose = useCallback(() => {
    setIsCameraActive(false);
    setErrorMessage(null); // Added here
  }, [setIsCameraActive, setErrorMessage]);

  const clickCamera = useCallback(() => {
    setIsCameraActive(true);
    setErrorMessage(null); // Added here
  }, [setIsCameraActive, setErrorMessage]);

  return {
    isCameraActive,
    handleOnClose,
    clickCamera,
    setIsCameraActive,
  };
};

export const useBeepSound = () => {
  const beep = useMemo(
    () =>
      new Sound('scanner_beep.mp3', Sound.MAIN_BUNDLE, error => {
        if (error) {
          Sentry.captureException(error);
          throw error;
        }
      }),
    [],
  );

  const alternativeBeep = useMemo(
    () =>
      new Sound('alternative_sound.mp3', Sound.MAIN_BUNDLE, error => {
        if (error) {
          Sentry.captureException(error);
          throw error;
        }
      }),
    [],
  );

  return {beep, alternativeBeep};
};

export const useOnBarCodeRead = (
  onChangeHandler: (value: string) => void,
  setIsCameraActive: React.Dispatch<React.SetStateAction<boolean>>,
  {beep, alternativeBeep}: {beep: Sound; alternativeBeep: Sound},
) => {
  return useCallback(
    (scanResult: BarCodeReadEvent) => {
      if (scanResult.data) {
        onChangeHandler(scanResult.data);
        setIsCameraActive(false);
        beep.play(success => {
          if (!success) {
            Sentry.captureMessage('A hang nem játszódott le', 'warning');
            alternativeBeep.play();
          }
        });
      }
      return;
    },
    [onChangeHandler, setIsCameraActive, beep, alternativeBeep],
  );
};
