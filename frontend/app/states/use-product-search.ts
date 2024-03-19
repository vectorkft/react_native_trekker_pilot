import React, {useCallback, useEffect, useRef, useState} from 'react';
import {TextInput} from 'react-native';
import * as Sentry from '@sentry/react';
import {ValidationResult} from '../interfaces/validation-result';
import {parseZodError} from '../../../shared/services/zod-dto.service';
import {ZodError} from 'zod';

export const useInputChange = (searchQuery: string) => {
  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    if (!searchQuery && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchQuery]);

  return {
    inputRef,
  };
};

export const useOnChangeHandler = (
  validateFormArray: (value: string) => Promise<ValidationResult>,
  getProductByEAN: (value: string) => Promise<any>,
  getProductByNumber: (value: string) => Promise<any>,
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>,
) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQueryVal, setSearchQueryVal] = useState<string>('');
  const [changeHandlerResult, setChangeHandlerResult] = useState<any>(null);

  const onChangeHandler = useCallback(
    async (value: string) => {
      setErrorMessage(null);

      try {
        const {isValid, error, validType} = await validateFormArray(value);

        if (!isValid) {
          const msg = await parseZodError(<ZodError>error);
          setErrorMessage(msg);
          setSearchQuery('');
          return;
        }

        // TODO: mindkettő eset
        let response;
        if (validType === 'eankod') {
          response = await getProductByEAN(value);
        } else if (validType === 'cikkszam') {
          response = await getProductByNumber(value);
        }

        if (response) {
          setChangeHandlerResult(response);
        }

        setSearchQueryVal(value);
        setSearchQuery('');
      } catch (e: any) {
        Sentry.captureException(e);
      }
    },
    [validateFormArray, getProductByEAN, getProductByNumber, setSearchQuery],
  );

  return [
    errorMessage,
    searchQueryVal,
    changeHandlerResult,
    onChangeHandler,
    setErrorMessage,
  ];
};
