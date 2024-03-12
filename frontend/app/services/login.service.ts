import {ApiService} from './api.service';
import {tokenHandlingService} from './token-handling.service';
import {
  UserLoginDTOOutput,
  ZUserLoginDTOInput,
  ZUserLoginDTOOutput,
} from '../../../shared/dto/user-login.dto';
import {LocalStorageService} from './local-storage.service';

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
  ): Promise<ZUserLoginDTOOutput | undefined> => {
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
      console.log('Hiba történt!', 'Az API nem elérhető.');
    }
  },

  handleLogout: async (): Promise<boolean | undefined> => {
    const options = {
      method: 'GET',
      accessToken: await tokenHandlingService.getTokenIfValid(),
    };

    try {
      const result = await ApiService.doRequest(
        '/protected/user/logout',
        options,
      );

      if (result.status === 200) {
        return true;
      } else {
        console.log('Hiba:', result);
        return false;
      }
    } catch (error: any) {
      console.log('Hiba történt!', 'Az API nem elérhető.', error);
    }
  },
};
