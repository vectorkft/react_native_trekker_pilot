import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ZodError} from 'zod';
import {debounce} from 'lodash';
import {TextInput} from 'react-native';

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
  validateForm: (value: number) => Promise<{isValid: boolean; error: ZodError}>,
  parseZodError: (error: ZodError) => Promise<string>,
  getArticlesByEAN: (value: number) => Promise<any>,
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
        const {isValid, error} = await validateForm(value);

        if (!isValid) {
          const msg = await parseZodError(error);
          setErrorMessage(msg);
          setSearchQuery('');
          return;
        }

        const response = await getArticlesByEAN(value);
        setChangeHandlerResult(response);
        setSearchQueryState(value);
        setSearchQuery('');
      } catch (errors: any) {
        console.log('Hiba történt', errors);
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
