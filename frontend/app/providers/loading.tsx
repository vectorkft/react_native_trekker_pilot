import React, {createContext, ReactNode, useState} from 'react';
import {LoadingProps} from '../interfaces/loading-context-type';
export const LoadingContext = createContext<LoadingProps>({
  loading: false,
  setLoadingState: () => {},
});

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
