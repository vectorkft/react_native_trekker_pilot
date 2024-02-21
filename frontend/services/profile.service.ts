import {tokenhandlingService} from "./tokenhandling.service";
import {RequestInitFactory} from "../factory/requestinitfactory";

export const profileService = () => {
    const tokenService = tokenhandlingService();

    const handleUserProfileRequest  = async () => {
        try {
            const options = {
                method: "POST",
                accessToken: await tokenService.getTokenIfValid()
            };

            return await RequestInitFactory.doRequest('/profile', options);

        } catch (error) {
            console.log('Az API nem elérhető.', error);
        }
    }

    return {
        handleUserProfileRequest,
    };

};
