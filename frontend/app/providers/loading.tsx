import React, {createContext, ReactNode, useState} from 'react';
import {LoadingState} from '../interfaces/loading-context-type';

const defaultContextValue = {
  loading: false,
  setLoadingState: () => {},
};
export const LoadingContext =
  createContext<LoadingState>(defaultContextValue);

export const LoadingProvider = ({children}: {children: ReactNode}) => {
  const [loading, setLoading] = useState(false);

  const setLoadingState = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  return (
    <LoadingContext.Provider value={{loading, setLoadingState}}>
      {children}
    </LoadingContext.Provider>
  );
};
