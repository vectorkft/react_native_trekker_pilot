import {useStore} from '../states/zustand-states';
import jwtDecode from 'jwt-decode';
import {DecodedToken} from '../interfaces/decoded-token';
import {ApiService} from './api.service';
import {
  parseZodError,
  validateZDTOForm,
} from '../../../shared/services/zod-dto.service';
import {
  TokenDTOInput,
  TokenDTOOutput,
  ZTokenDTOInput,
  ZTokenDTOOutput,
} from '../../../shared/dto/token.dto';
import {NavigationService} from './navigation.service';
import {ZodError} from 'zod';

const isTokenExpired = (token: string): boolean => {
  if (!token) {
    console.log('Nincs token.');
    return false;
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp >= currentTime;
  } catch (error) {
    console.log('Hiba a token dekódolása közben:', error);
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
    return await ApiService.doRequest(
      '/token/refresh',
      options,
      TokenDTOOutput,
    );
  } catch (error) {
    console.log('Hiba történt az API hívás során:', error);
  }
};

export const tokenHandlingService = {
  getTokenIfValid: async (): Promise<string> => {
    const {accessToken, refreshToken, setAccessToken} = useStore.getState();

    if (isTokenExpired(accessToken)) {
      return accessToken;
    }

    if (isTokenExpired(refreshToken)) {
      const {isValid, error} = (await validateZDTOForm(TokenDTOInput, {
        refreshToken,
      })) as {isValid: boolean; error: ZodError};

      if (isValid) {
        const newToken = await refreshAccessToken({refreshToken});

        if (newToken) {
          setAccessToken(newToken.newAccessToken);
          return newToken.newAccessToken;
        } else {
          return '';
        }
      } else {
        const msg = await parseZodError(error);
        console.log('Nem valid token!', msg);
      }
    }

    NavigationService.redirectToLogin();
    return '';
  },
};
