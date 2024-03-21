import React, {useMemo, useState} from 'react';
import Sound from 'react-native-sound';
import * as Sentry from '@sentry/react-native';

export const useCamera = (
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleOnClose = () => {
    setIsCameraActive(false);
    setErrorMessage(null);
  };

  const clickCamera = () => {
    setIsCameraActive(true);
    setErrorMessage(null);
  };

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
