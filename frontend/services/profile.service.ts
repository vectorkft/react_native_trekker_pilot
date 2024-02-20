import {useStore} from "../states/state";
import {Alert} from "react-native";
import {tokenhandlingService} from "./tokenhandling.service";
import {API_URL} from "../config";

export const profileService = () => {
    const { id } = useStore.getState();
    const tokenService = tokenhandlingService();

    const checkToken = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "id": id
        });

        const requestOptions: RequestInit = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch(`${API_URL}/profile`, requestOptions);
            const result = await response.text();

            if(await tokenService.getNewToken()){
                Alert.alert('Az accessToken frissítve.');
            } else if (await tokenService.checkAccessToken()){
                Alert.alert('Az accessToken még érvényes.')
            } else {
                Alert.alert('Nem sikerült frissíteni az accessToken-t.');
            }

        } catch (error) {
            Alert.alert('Az API nem elérhető.', error.message);
        }
    }

    return {
        checkToken
    };

};
