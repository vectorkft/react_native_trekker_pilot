import React, {useCallback, useMemo, useState} from 'react';
import Sound from 'react-native-sound';

export const useCamera = (
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanned, setScanned] = useState(true);

  const handleOnClose = useCallback(() => {
    setIsCameraActive(false);
    setScanned(true);
    setErrorMessage(null); // Added here
  }, [setIsCameraActive, setScanned, setErrorMessage]);

  const clickCamera = useCallback(() => {
    setIsCameraActive(true);
    setScanned(false);
    setErrorMessage(null); // Added here
  }, [setIsCameraActive, setScanned, setErrorMessage]);

  return {
    isCameraActive,
    scanned,
    handleOnClose,
    clickCamera,
    setScanned,
    setIsCameraActive,
  };
};

export const useBeepSound = () => {
  return useMemo(
    () =>
      new Sound('scanner_beep.mp3', Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log('Hiba történt a hangfájl betöltésekor', error);
        }
      }),
    [],
  );
};

export const useOnBarCodeRead = (
  onChangeHandler: (value: number) => void,
  scanned: boolean,
  setScanned: React.Dispatch<React.SetStateAction<boolean>>,
  setIsCameraActive: React.Dispatch<React.SetStateAction<boolean>>,
  beep: Sound,
) => {
  return useCallback(
    (scanResult: any) => {
      if (scanResult.data && !scanned) {
        onChangeHandler(scanResult.data);
        setScanned(true);
        setIsCameraActive(false);
        beep.play(success => {
          if (!success) {
            console.log('A hang nem játszódott le');
          }
        });
      }
    },
    [onChangeHandler, scanned, setScanned, setIsCameraActive, beep],
  );
};
