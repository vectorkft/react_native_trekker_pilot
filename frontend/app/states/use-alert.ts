import {useState} from 'react';

export const useAlert = (initialMessage = '') => {
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState(initialMessage);

  const showError = (message: string) => {
    setErrorMessage(message);
    setShowAlert(true);
  };

  const hideError = () => {
    setShowAlert(false);
  };

  return {showAlert, errorMessage, showError, hideError};
};
