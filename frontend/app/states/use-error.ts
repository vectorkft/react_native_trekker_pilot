import {useState} from 'react';

export const useError = () => {
  const [hasError, setHasError] = useState(false);
  const [errorCode, setErrorCode] = useState(0);

  const setError = (error: any, changeHasError?: boolean) => {
    if (changeHasError) {
      setHasError(false);
      error = null;
    } else {
      setHasError(true);
      setErrorCode(parseInt(error.message, 10));
    }
  };

  return {hasError, errorCode, setError};
};
