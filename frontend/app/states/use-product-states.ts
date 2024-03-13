import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ZodError} from 'zod';
import {debounce} from 'lodash';
import {TextInput} from 'react-native';
import * as Sentry from '@sentry/react';

export const useInputChange = (
  onChangeHandler: (value: number) => void,
  searchQuery: string,
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>,
) => {
  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    if (!searchQuery && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchQuery]);

  const onChangeInput = useCallback(
    (value: string) => {
      onChangeHandler(Number(value));
      setSearchQuery(value);
    },
    [onChangeHandler, setSearchQuery],
  );

  const onChangeInputWhenEnabled = useCallback(
    (text: string) => {
      setSearchQuery(text);
    },
    [setSearchQuery],
  );

  return {
    inputRef,
    onChangeInput,
    onChangeInputWhenEnabled,
    searchQuery,
    setSearchQuery,
  };
};

export const useOnChangeHandler = (
  validateFormEAN: (value: number) => Promise<{isValid: boolean; error: ZodError}>,
  validateFormProductNumber: (value: number) => Promise<{isValid: boolean; error: ZodError}>,
  parseZodError: (error: ZodError) => Promise<string>,
  getProductByEAN: (value: number) => Promise<any>,
  getProductByNumber: (value: number) => Promise<any>,
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>,
) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQueryState, setSearchQueryState] = useState<number | string>(0);
  const [changeHandlerResult, setChangeHandlerResult] = useState<any>(null);

  const debouncedOnChangeHandler = useRef(
    debounce(async (value: number) => {
      setErrorMessage(null);

      if (isNaN(value)) {
        setErrorMessage('Kérjük, adjon meg egy érvényes számot.');
        setSearchQuery('');
        return;
      }
      try {
        const {isValid: isValidEAN, error: errorEAN} = await validateFormEAN(value);
        const {isValid: isValidProductNumber, error: errorProductNumber} = await validateFormProductNumber(value);


        if (!isValidEAN && !isValidProductNumber) {
          const msgEAN = await parseZodError(errorEAN);
          const msgProductNumber = await parseZodError(errorProductNumber);
          setErrorMessage(`${msgEAN} ${msgProductNumber}`);
          setSearchQuery('');
          return;
        }

        const responseEAN = await getProductByEAN(value);

        if (responseEAN && isValidEAN) {
          setChangeHandlerResult(responseEAN);
        } else {
          const responseProductNumber = await getProductByNumber(value);
          if (responseProductNumber && isValidProductNumber) {
            setChangeHandlerResult(responseProductNumber);
          }
        }
        setSearchQueryState(value);
        setSearchQuery('');
      } catch (e: any) {
        Sentry.captureException(e);
      }
    }),
  );

  const onChangeHandler = useCallback(
    (value: number) => {
      debouncedOnChangeHandler.current(value);
    },
    [debouncedOnChangeHandler],
  );

  return [
    errorMessage,
    searchQueryState,
    changeHandlerResult,
    onChangeHandler,
    setErrorMessage,
  ];
};
