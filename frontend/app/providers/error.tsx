import React, {ReactNode, createContext, useEffect} from 'react';
import {navigationRef} from '../services/navigation';
import {isConnected} from '../services/net-info';
export const ErrorContext = createContext({
  hasError: false,
  errorCode: 0,
  setError: (error: any, changeError: boolean | undefined) => {},
});

export function ErrorProvider({children}: {children: ReactNode}) {
  const {hasError, errorCode} = React.useContext(ErrorContext);

  useEffect(() => {
    if (hasError && isConnected) {
      navigationRef.current?.navigate('errorScreen', {
        errorCodeParam: errorCode,
      });
    }
  }, [hasError, errorCode]);

  return <>{children}</>;
}
