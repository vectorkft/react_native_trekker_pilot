import React, {useCallback, useEffect, useRef, useState} from 'react';
import {TextInput} from 'react-native';
import * as Sentry from '@sentry/react';
import {ValidationResult} from '../interfaces/validation-result';
import {parseZodError} from '../../../shared/services/zod-dto.service';
import {ZodError} from 'zod';
import {ZProductListOutput} from '../../../shared/dto/product.dto';

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
  const [changeHandlerResult, setChangeHandlerResult] = useState<
    | string
    | React.Dispatch<React.SetStateAction<string | null>>
    | ZProductListOutput[]
    | ((value: string) => Promise<void>)
    | null
  >(null);

  const onChangeHandler = useCallback(
    async (value: string) => {
      setErrorMessage(null);

      try {
        const {isValid, error, validTypes} = await validateFormArray(value);

        if (!isValid) {
          const msg = await parseZodError(<ZodError>error);
          setErrorMessage(msg);
          setSearchQuery('');
          return;
        }

        let responses = [];

        let valuesAreEqual =
          validTypes?.includes('eankod') && validTypes?.includes('cikkszam');

        if (valuesAreEqual) {
          responses.push(await getProductByEAN(value));
        } else {
          if (validTypes?.includes('eankod')) {
            responses.push(await getProductByEAN(value));
          }

          if (validTypes?.includes('cikkszam')) {
            responses.push(await getProductByNumber(value));
          }
        }

        if (responses.length > 0) {
          setChangeHandlerResult([].concat(...responses));
        }

        setSearchQueryVal(value);
        setSearchQuery('');
      } catch (e) {
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
