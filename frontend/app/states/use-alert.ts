import {useState} from 'react';

export const useAlert = (initialMessage = '') => {
  const [errorMessage, setErrorMessageState] = useState<string | null>(
    initialMessage,
  );

  const setErrorMessage = (message: string | null) => {
    setErrorMessageState(message);
  };

  return {errorMessage, setErrorMessage};
};
