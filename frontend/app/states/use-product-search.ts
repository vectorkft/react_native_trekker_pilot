import React, {useCallback, useEffect, useRef, useState} from 'react';
import {TextInput} from 'react-native';
import * as Sentry from '@sentry/react';
import {ValidationResult} from '../interfaces/validation-result';
import {parseZodError} from '../../../shared/services/zod-dto.service';
import {ZodError} from 'zod';
import {ZProductListOutput} from '../../../shared/dto/product.dto';
import {ValidTypes} from '../../../shared/enums/types';

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
  getProduct: (
    value: string,
    validType: ValidTypes,
  ) => Promise<ZProductListOutput | Response | undefined>,
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>,
) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQueryVal, setSearchQueryVal] = useState<string>('');
  const [changeHandlerResult, setChangeHandlerResult] = useState<
    | string
    | React.Dispatch<React.SetStateAction<string | null>>
    | ZProductListOutput
    | ((value: string) => Promise<void>)
    | null
  >(null);

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

        const response = await getProduct(value, validType as ValidTypes);

        if (response) {
          setChangeHandlerResult(response as ZProductListOutput);
        }

        setSearchQueryVal(value);
        setSearchQuery('');
      } catch (e) {
        Sentry.captureException(e);
      }
    },
    [validateFormArray, getProduct, setSearchQuery],
  );

  return [
    errorMessage,
    searchQueryVal,
    changeHandlerResult,
    onChangeHandler,
    setErrorMessage,
  ];
};
