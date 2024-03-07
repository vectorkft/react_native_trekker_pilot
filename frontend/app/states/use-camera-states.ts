import React, {
    useCallback,
    useMemo, useRef,
    useState,
} from 'react';
import Sound from 'react-native-sound';
import {ZodError} from 'zod';

export const useCamera = (
    setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
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

export const useInputChange = (
    onChangeHandler: (value: number) => void,
) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeInput = useCallback(
        (value: number) => {   // Add 'number' as the type of `value`.
            onChangeHandler(value);
            setSearchQuery(value.toString());  // Convert the number to a string before setting the search query.
        },
        [onChangeHandler, setSearchQuery],
    );

    const onChangeInputWhenEnabled = useCallback(
        (text: string) => {
            setSearchQuery(text);
        },
        [setSearchQuery],
    );

    return {onChangeInput, onChangeInputWhenEnabled, searchQuery, setSearchQuery};
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

export const useOnChangeHandler = (
    validateForm: (value: number) => Promise<{isValid: boolean; error: ZodError}>,
    parseZodError: (error: ZodError) => Promise<string>,
    getArticlesByEAN: (value: number) => Promise<any>,
) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [searchQueryState, setSearchQueryState] = useState<number>(0);
    const [changeHandlerResult, setChangeHandlerResult] = useState<any>(null);
    const timeout = useRef(0); // Added here

    const onChangeHandler = useCallback(
        (value: number) => {
            clearTimeout(timeout.current);
            timeout.current = setTimeout(async () => {
                const eanNumber = Number(value);
                setErrorMessage(null);

                if (isNaN(eanNumber)) {
                    setErrorMessage('Kérjük, adjon meg egy érvényes számot.');
                    return;
                }
                try {
                    const {isValid, error} = await validateForm(eanNumber);

                    if (!isValid) {
                        const msg = await parseZodError(error);
                        setErrorMessage(msg);
                        return;
                    }

                    const response = await getArticlesByEAN(eanNumber);
                    setChangeHandlerResult(response);
                    setSearchQueryState(value);
                } catch (errors: any) {
                    console.log('Hiba történt', errors);
                }
            }, 100);
        },
        [setErrorMessage, validateForm, parseZodError, getArticlesByEAN, setChangeHandlerResult, setSearchQueryState]
    );

    return [errorMessage, searchQueryState, changeHandlerResult, onChangeHandler, setErrorMessage];
};

export const useOnBarCodeRead = (
    onChangeHandler: (value: number) => void,
    scanned: boolean,
    setScanned: React.Dispatch<React.SetStateAction<boolean>>,
    setIsCameraActive: React.Dispatch<React.SetStateAction<boolean>>,
    beep: Sound
) => {
    return useCallback(
      (scanResult: any) => {
        if (scanResult.data != null && !scanned) {
          onChangeHandler(scanResult.data);
          setScanned(true);
          setIsCameraActive(false);
          beep.play(success => {
            if (!success) console.log('A hang nem játszódott le');
          });
        }
      },
      [beep, onChangeHandler, scanned, setScanned, setIsCameraActive],
    );
};
