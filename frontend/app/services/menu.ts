import {TokenHandlingService} from './token-handling';
import {ApiService} from './api';
import * as Sentry from '@sentry/react-native';
import {MenuListOutput, ZMenuInput} from '../../../shared/dto/menu';
import {ApiResponseOutput} from '../types/api-response';

export const ProfileService = {
  handleUserProfileRequest: async (
    input: ZMenuInput,
    setError: (error: any, changeValue?: boolean | undefined) => void,
  ): Promise<ApiResponseOutput | undefined> => {
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify(input),
        accessToken: await TokenHandlingService.getTokenIfValid(setError),
      };

      return await ApiService.doRequest(
        '/protected/menu',
        options,
        MenuListOutput,
      );
    } catch (error) {
      setError(error);
      Sentry.captureException(error);
    }
  },
};
