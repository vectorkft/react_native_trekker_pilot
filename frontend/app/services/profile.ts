import {TokenHandlingService} from './token-handling';
import {ApiService} from './api';
import * as Sentry from '@sentry/react-native';

export const ProfileService = {
  handleUserProfileRequest: async () => {
    try {
      const options = {
        method: 'POST',
        accessToken: await TokenHandlingService.getTokenIfValid(),
      };

      return await ApiService.doRequest('/protected/user/profile', options);
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },
};
