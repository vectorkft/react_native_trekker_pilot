import {useStore} from "../states/states";
import jwtDecode from 'jwt-decode';
import {DecodedToken} from '../interfaces/decoded-token';
import {RequestinitFactory} from "../factory/requestinit-factory";

const isTokenExpired = (token: string | null): boolean => {
    try{
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            console.log('A token lejárt.');
            return false;
        } else {
            console.log('A token érvényes.');
            return true;
        }
    } catch (error) {
        console.log('Hiba a token dekódolása közben:', error.message);
    }
};

const refreshAccessToken = async () => {
    const { refreshToken } = useStore.getState();

    const options = {
        method: 'POST',
        body: JSON.stringify({
            "refreshToken": refreshToken
        }),
    };

    try {
        return await RequestinitFactory.doRequest('/refresh', options);
    } catch (error) {
        console.log('Hiba történt az API hívás során:', error.message);
    }
};

export const tokenHandlingService = {

    // TODO: ha nincs token akkor route vissza loginra

    getTokenIfValid : async (): Promise<string> => {
        const { accessToken, refreshToken, setAccessToken } = useStore.getState();
        let token: string = null;

        if (isTokenExpired(accessToken)) {
            token = accessToken;
        } else {
            if (isTokenExpired(refreshToken)) {
                const success = await refreshAccessToken();
                if (success.status === 200) {
                    setAccessToken(success.newAccessToken);
                    token = success.newAccessToken;
                    console.log('Az accessToken frissítve.');
                } else {
                    console.log('Nem sikerült frissíteni az accessToken-t.');
                }
            }
        }

        return token;
    },
}