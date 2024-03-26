import React, {ReactNode, createContext, useContext} from 'react';
import {ErrorScreen} from '../screens/error-screen';
export const ErrorContext = createContext({
  hasError: false,
  errorCode: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setError: (error: any, changeError: boolean | undefined) => {},
});

export function ErrorProvider({children}: {children: ReactNode}) {
  const {hasError, errorCode} = React.useContext(ErrorContext);
  const {setError} = useContext(ErrorContext);

  if (hasError) {
    return (
      <ErrorScreen errorCode={errorCode} onClick={() => setError(null, true)} />
    );
  }

  return children;
}
