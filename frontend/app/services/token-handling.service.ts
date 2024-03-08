import {useStore} from '../states/zustand-states';
import jwtDecode from 'jwt-decode';
import {DecodedToken} from '../interfaces/decoded-token';
import {RequestInitFactory} from '../factory/request-init-factory';
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

const isTokenExpired = (token: string | null): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode(<string>token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      console.log('A token lejárt.');
      return false;
    } else {
      console.log('A token érvényes.');
      return true;
    }
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
    return await RequestInitFactory.doRequest(
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
    let token: string | null = null;

    if (isTokenExpired(accessToken)) {
      token = accessToken;
    } else {
      if (isTokenExpired(refreshToken)) {
        const {isValid, error} = await validateZDTOForm(TokenDTOInput, {
          refreshToken: refreshToken,
        });
        if (isValid) {
          const newToken = await refreshAccessToken({
            refreshToken: refreshToken,
          });
          if (newToken) {
            setAccessToken(newToken.newAccessToken);
            token = newToken.newAccessToken;
            console.log('Az accessToken frissítve.');
          } else {
            console.log('Nem sikerült frissíteni az accessToken-t.');
          }
        } else {
          const msg = await parseZodError(<ZodError>error);
          console.log('Nem valid token!', msg);
        }
      }
    }

    if (token === null) {
      NavigationService.redirectToLogin();
    }

    return <string>token;
  },
};
