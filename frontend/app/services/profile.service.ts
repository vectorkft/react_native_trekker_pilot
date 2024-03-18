import {tokenHandlingService} from './token-handling.service';
import {ApiService} from './api.service';
import * as Sentry from '@sentry/react-native';

export const profileService = {
  handleUserProfileRequest: async () => {
    try {
      const options = {
        method: 'POST',
        accessToken: await tokenHandlingService.getTokenIfValid(),
      };

      return await ApiService.doRequest('/protected/user/profile', options);
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },
};
