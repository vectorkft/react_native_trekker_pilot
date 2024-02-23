import {tokenHandlingService} from "./token-handling.service";
import {RequestinitFactory} from "../factory/requestinit-factory";

export const profileService = {

    handleUserProfileRequest : async () => {
        try {
            const options = {
                method: "POST",
                accessToken: await tokenHandlingService.getTokenIfValid()
            };

            return await RequestinitFactory.doRequest('/profile', options);

        } catch (error) {
            console.log('Az API nem elérhető.', error);
        }
    },
};
