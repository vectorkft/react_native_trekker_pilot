import AsyncStorage from '@react-native-async-storage/async-storage';
import {RequestInitFactory} from '../factory/request-init-factory';
import {tokenHandlingService} from './token-handling.service';
import {
  UserLoginDTOInput,
  UserLoginDTOOutput,
  ZUserLoginDTOInput,
  ZUserLoginDTOOutput,
} from '../../../shared/dto/user-login.dto';
import {zParse} from '../../../shared/services/zod-dto.service';
import {ValidateForm} from '../interfaces/validate-form';

export const LoginService = {
  loadUsernameAndRememberMe: async () => {
    const [savedUsername, savedRememberMe] = await AsyncStorage.multiGet([
      'username',
      'rememberMe',
    ]);
    return {
      username: savedUsername[1] ? savedUsername[1] : '',
      rememberMe: savedRememberMe[1] ? JSON.parse(savedRememberMe[1]) : false,
    };
  },

  validateForm: async (formData: ZUserLoginDTOInput): Promise<ValidateForm> => {
    try {
      const body: ZUserLoginDTOInput = await zParse(
        UserLoginDTOInput,
        formData,
      );
      console.log(body);
    } catch (error: any) {
      console.log(error);
      return {
        error: error,
        isValid: false,
      };
    }

    return {
      error: null,
      isValid: true,
    };
  },

  handleSubmit: async (
    input: ZUserLoginDTOInput,
  ): Promise<ZUserLoginDTOOutput | undefined> => {
    const options = {
      method: 'POST',
      body: JSON.stringify(input),
    };

    try {
      const result = await RequestInitFactory.doRequest('/login', options);

      if (result.status === 200) {
        try {
          return await zParse(UserLoginDTOOutput, result);
        } catch (error) {
          console.log('Hiba:', error);
        }
      } else {
        const res = await result.json();
        console.log('Hiba:', res.message);
        return undefined;
      }
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
      const result = await RequestInitFactory.doRequest('/logout', options);

      if (result.status === 200) {
        return true;
      } else {
        const res = await result.json();
        console.log('Hiba:', res.message);
        return false;
      }
    } catch (error: any) {
      console.log('Hiba történt!', 'Az API nem elérhető.', error);
    }
  },
};
