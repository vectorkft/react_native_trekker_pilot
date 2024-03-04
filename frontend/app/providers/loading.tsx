import React, {createContext, ReactNode, useState} from 'react';
import {LoadingContextType} from '../interfaces/loading-context-type';
export const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined,
);

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
