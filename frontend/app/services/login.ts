import {ApiService} from './api';
import {TokenHandlingService} from './token-handling';
import {
  UserLoginDTOOutput,
  ZUserLoginDTOInput,
} from '../../../shared/dto/user-login';
import {LocalStorageService} from './local-storage';
import * as Sentry from '@sentry/react-native';
import {
  RESPONSE_SUCCESS,
  RESPONSE_UNAUTHORIZED,
} from '../constants/response-status';
import {ApiResponseOutput} from '../interfaces/api-response';
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
    rememberMe: boolean,
    handleError: (error: string) => void,
    handleSubmit: (response: ApiResponseOutput, rememberMe: boolean) => void,
    setError: (error: any, changeValue?: boolean | undefined) => void,
  ): Promise<void> => {
    const options = {
      method: 'POST',
      body: JSON.stringify(input),
    };

    ApiService.doRequest('/user/login', options, UserLoginDTOOutput)
      .then(response => {
        if ('error' in response && response.status === RESPONSE_UNAUTHORIZED) {
          handleError('Hibás felhasználónév vagy jelszó!');
        } else {
          if (rememberMe) {
            LocalStorageService.storeData({
              username: input.name,
              rememberMe: true,
            });
          } else {
            LocalStorageService.deleteData(['username']);
            LocalStorageService.storeData({rememberMe: false});
          }
          handleSubmit(response, rememberMe);
        }
      })
      .catch(error => {
        setError(error);
        Sentry.captureException(error);
      });
  },

  handleLogout: async (
    handleSuccess: () => void,
    handleError: () => void,
    setError: (error: any, changeValue?: boolean | undefined) => void,
  ): Promise<void> => {
    const options = {
      method: 'GET',
      accessToken: await TokenHandlingService.getTokenIfValid(setError),
    };

    ApiService.doRequest('/protected/user/logout', options)
      .then(response => {
        if (response.status === RESPONSE_SUCCESS) {
          handleSuccess();
        } else {
          handleError();
        }
      })
      .catch(error => {
        setError(error);
        Sentry.captureException(error);
      });
  },
};
