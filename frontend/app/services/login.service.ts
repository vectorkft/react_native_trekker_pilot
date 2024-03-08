import {RequestInitFactory} from '../factory/request-init-factory';
import {tokenHandlingService} from './token-handling.service';
import {
  UserLoginDTOOutput,
  ZUserLoginDTOInput,
  ZUserLoginDTOOutput,
} from '../../../shared/dto/user-login.dto';
import {MMKV} from 'react-native-mmkv';

export const LoginService = {
  loadUsernameAndRememberMe: () => {
    const storage = new MMKV({
      id: 'app',
    });

    const username = storage.getString('username') || '';
    const rememberMe = storage.getBoolean('rememberMe') || false;

    return {username, rememberMe};
  },

  handleSubmit: async (
    input: ZUserLoginDTOInput,
  ): Promise<ZUserLoginDTOOutput | undefined> => {
    const options = {
      method: 'POST',
      body: JSON.stringify(input),
    };

    try {
      return await RequestInitFactory.doRequest(
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
      const result = await RequestInitFactory.doRequest(
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
