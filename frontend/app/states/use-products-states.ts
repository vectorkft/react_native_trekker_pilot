import React, {useCallback, useRef, useState} from 'react';
import {ZodError} from 'zod';
import {debounce} from 'lodash';

export const useInputChange = (
  onChangeHandler: (value: number) => void,
  searchQuery: string,
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>,
) => {
  const onChangeInput = useCallback(
    (value: number) => {
      // Add 'number' as the type of `value`.
      onChangeHandler(value);
      setSearchQuery(value.toString()); // Convert the number to a string before setting the search query.
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
          setSearchQuery('');
          return;
        }

        const response = await getArticlesByEAN(eanNumber);
        setChangeHandlerResult(response);
        setSearchQueryState(value);
        setSearchQuery('');
      } catch (errors: any) {
        console.log('Hiba történt', errors);
      }
    }, 1000),
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
