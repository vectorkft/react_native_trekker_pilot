import React, {useCallback, useEffect, useRef, useState} from 'react';
import {TextInput} from 'react-native';
import * as Sentry from '@sentry/react';
import {ValidateForm} from '../interfaces/validate-form';

export const useInputChange = (
  onChangeHandler: (value: string) => void,
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
      onChangeHandler(value);
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
  validateFormArray: (value: string) => Promise<ValidateForm>,
  getProductByEAN: (value: string) => Promise<any>,
  getProductByNumber: (value: string) => Promise<any>,
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>,
) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQueryState, setSearchQueryState] = useState<number | string>(0);
  const [changeHandlerResult, setChangeHandlerResult] = useState<any>(null);

  const onChangeHandler = useCallback(
    async (value: string) => {
      setErrorMessage(null);

      try {
        const {isValid, error} = await validateFormArray(value);

        if (!isValid) {
          setErrorMessage('Nem megfelelő formátum, ellenőrizd az adatot!');
          setSearchQuery('');
          return;
        }

        const responseEAN = await getProductByEAN(value);

        if (responseEAN && isValid) {
          console.log('isvalid:', {isValid});
          setChangeHandlerResult(responseEAN);
        } else {
          const responseProductNumber = await getProductByNumber(value);
          if (responseProductNumber && isValid) {
            setChangeHandlerResult(responseProductNumber);
          }
        }
        setSearchQueryState(value);
        setSearchQuery('');
      } catch (e: any) {
        Sentry.captureException(e);
      }
    },
    [validateFormArray, getProductByEAN, getProductByNumber, setSearchQuery],
  );

  return [
    errorMessage,
    searchQueryState,
    changeHandlerResult,
    onChangeHandler,
    setErrorMessage,
  ];
};
