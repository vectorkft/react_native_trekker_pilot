import React, {createContext, ReactNode, useState} from 'react';
import {LoadingState} from '../interfaces/loading-context-type';
export const LoadingContext = createContext<LoadingState>({
  loading: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
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
