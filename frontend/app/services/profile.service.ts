import {tokenHandlingService} from './token-handling.service';
import {RequestInitFactory} from '../factory/request-init-factory';

export const profileService = {
  handleUserProfileRequest: async () => {
    try {
      const options = {
        method: 'POST',
        accessToken: await tokenHandlingService.getTokenIfValid(),
      };

      return await RequestInitFactory.doRequest(
        '/protected/user/profile',
        options,
      );
    } catch (error) {
      console.log('Az API nem elérhető.', error);
    }
  },
};
