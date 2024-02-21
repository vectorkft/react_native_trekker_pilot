import {tokenhandlingService} from "./tokenhandling.service";
import {RequestInitFactory} from "../factory/requestinitfactory";
import {API_URL} from "../config";
import {useStore} from "../states/state";

export const profileService = () => {
    const tokenService = tokenhandlingService();
    const { id } = useStore.getState();

    const handleUserProfileRequest  = async () => {
        try {
            const requestInitFactory = new RequestInitFactory(`${API_URL}`);

            const options = {
                method: "POST",
                body: JSON.stringify({"id": id}),
                accessToken: await tokenService.getTokenIfValid()
            };

            const response =
                await fetch(`${requestInitFactory.baseUrl}/profile`, requestInitFactory.getClient(options));

            //TODO: válasz is mehetne bele
            return await response.json();

        } catch (error) {
            console.log('Az API nem elérhető.', error);
        }
    }

    return {
        handleUserProfileRequest,
    };

};
