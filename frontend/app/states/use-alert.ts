import {useState, Dispatch, SetStateAction} from 'react';

export const useAlert = (initialMessage = '') => {
  const [errorMessage, setErrorMessageState] = useState<string | null>(
    initialMessage,
  );

  const setErrorMessage: Dispatch<SetStateAction<string | null>> = value =>
    typeof value === 'function'
      ? setErrorMessageState(value(errorMessage))
      : setErrorMessageState(value);

  return {errorMessage, setErrorMessage};
};
