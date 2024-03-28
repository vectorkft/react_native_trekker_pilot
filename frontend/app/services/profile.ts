import {TokenHandlingService} from './token-handling';
import {ApiService} from './api';
import * as Sentry from '@sentry/react-native';
import {ApiResponseOutput} from '../types/api-response';

export const ProfileService = {
  handleUserProfileRequest: async (
    setError: (error: any, changeValue?: boolean | undefined) => void,
  ): Promise<ApiResponseOutput | undefined> => {
    try {
      const options = {
        method: 'POST',
        accessToken: await TokenHandlingService.getTokenIfValid(setError),
      };

      return await ApiService.doRequest('/protected/user/profile', options);
    } catch (error) {
      setError(error);
      Sentry.captureException(error);
    }
  },
};
