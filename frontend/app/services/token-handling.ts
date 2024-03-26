import {useStore} from '../states/zustand';
import jwtDecode from 'jwt-decode';
import {ExpInterface} from '../interfaces/decoded-token';
import {ApiService} from './api';
import {parseZodError, validateZDTOForm} from '../../../shared/services/zod';
import {
  TokenDTOInput,
  TokenDTOOutput,
  ZTokenDTOInput,
  ZTokenDTOOutput,
} from '../../../shared/dto/token';
import {ZodError} from 'zod';
import * as Sentry from '@sentry/react-native';
import {NavigationService} from './navigation';

const isTokenExpired = (token: string): boolean => {
  const MILLISECONDS_PER_SECOND = 1000;
  if (!token) {
    return false;
  }

  try {
    const decoded: ExpInterface = jwtDecode(token);
    const currentTime = Date.now() / MILLISECONDS_PER_SECOND;

    return decoded.exp >= currentTime;
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
};

const refreshAccessToken = async (
  input: ZTokenDTOInput,
): Promise<ZTokenDTOOutput | undefined> => {
  const options = {
    method: 'POST',
    body: JSON.stringify(input),
  };

  try {
    return (
      (await ApiService.doRequest('/token/refresh', options, TokenDTOOutput)) ??
      {}
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};

const handleZodError = async (error: ZodError) => {
  const msg = await parseZodError(error);
  Sentry.setTag('Invalid token', msg);
  return;
};

export const TokenHandlingService = {
  getTokenIfValid: async (
    setError: (error: any, changeValue?: boolean | undefined) => void,
  ): Promise<string | undefined> => {
    const {accessToken, refreshToken, setAccessToken} = useStore.getState();

    if (isTokenExpired(accessToken)) {
      return accessToken;
    }

    if (isTokenExpired(refreshToken)) {
      await validateZDTOForm(
        TokenDTOInput,
        {
          refreshToken,
        },
        handleZodError,
      );

      try {
        const response = await refreshAccessToken({refreshToken});

        if (response) {
          setAccessToken(response.newAccessToken);
          return response.newAccessToken;
        }
      } catch (e) {
        setError(e);
        Sentry.captureException(e);
      }
    } else {
      NavigationService.redirectToLogin();
    }
  },
};
