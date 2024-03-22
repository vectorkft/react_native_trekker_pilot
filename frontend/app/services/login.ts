import {ApiService} from './api';
import {TokenHandlingService} from './token-handling';
import {
  UserLoginDTOOutput,
  ZUserLoginDTOInput,
  ZUserLoginDTOOutput,
} from '../../../shared/dto/user-login';
import {LocalStorageService} from './local-storage';
import * as Sentry from '@sentry/react-native';
import {ZApiError} from '../../../shared/dto/api-error';

export const LoginService = {
  loadUsernameAndRememberMe: (): {
    username: string | undefined;
    rememberMe: boolean | undefined;
  } => {
    const usernameData = LocalStorageService.getDataString(['username']);
    const username = usernameData ? usernameData.username : '';
    const rememberMeData = LocalStorageService.getDataBoolean(['rememberMe']);
    const rememberMe = rememberMeData ? rememberMeData.rememberMe : false;

    return {...{username}, ...{rememberMe}};
  },

  handleSubmit: async (
    input: ZUserLoginDTOInput,
  ): Promise<ZUserLoginDTOOutput | ZApiError> => {
    const options = {
      method: 'POST',
      body: JSON.stringify(input),
    };

    try {
      return await ApiService.doRequest(
        '/user/login',
        options,
        UserLoginDTOOutput,
      );
    } catch (error: any) {
      Sentry.captureException(error);
      throw error;
    }
  },

  handleLogout: async (): Promise<boolean | undefined> => {
    const options = {
      method: 'GET',
      accessToken: await TokenHandlingService.getTokenIfValid(),
    };

    try {
      const result = await ApiService.doRequest(
        '/protected/user/logout',
        options,
      );

      return result.status === 200;
    } catch (error: any) {
      Sentry.captureException(error);
      throw error;
    }
  },
};
