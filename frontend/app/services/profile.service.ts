import {tokenHandlingService} from './token-handling.service';
import {ApiService} from './api.service';

export const profileService = {
  handleUserProfileRequest: async () => {
    try {
      const options = {
        method: 'POST',
        accessToken: await tokenHandlingService.getTokenIfValid(),
      };

      return await ApiService.doRequest(
        '/protected/user/profile',
        options,
      );
    } catch (error) {
      console.log('Az API nem elérhető.', error);
    }
  },
};
