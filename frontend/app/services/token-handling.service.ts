import {useStore} from "../states/states";
import jwtDecode from 'jwt-decode';
import {DecodedToken} from '../interfaces/decoded-token';
import {RequestinitFactory} from "../factory/requestinit-factory";
import {zParse} from "./zod-dto.service";
import {TokenDTOInput, TokenDTOOutput, ZTokenDTOInput, ZTokenDTOOutput} from "../dto/token.dto";
import {NavigationService} from "./navigation.service";

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

const refreshAccessToken = async () : Promise<ZTokenDTOOutput> => {
    const { refreshToken } = useStore.getState();

    const options = {
        method: 'POST',
        body: JSON.stringify({
            "refreshToken": refreshToken
        }),
    };

    try {
        const result = await RequestinitFactory.doRequest('/refresh', options);

        if(result.status === 200){
            try {
                const body : ZTokenDTOInput = await zParse(TokenDTOInput, JSON.parse(options.body));
                const output : ZTokenDTOOutput = await zParse(TokenDTOOutput, result);
                console.log('Valid Token');
                return output;
            } catch (error){
                console.log('Hiba:', error);
            }
        }
    } catch (error) {
        console.log('Hiba történt az API hívás során:', error.message);
    }
};

export const tokenHandlingService = {

    getTokenIfValid : async (): Promise<string> => {
        const { accessToken, refreshToken, setAccessToken } = useStore.getState();
        let token: string = null;

        if (isTokenExpired(accessToken)) {
            token = accessToken;
        } else {
            if (isTokenExpired(refreshToken)) {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    setAccessToken(newToken.newAccessToken);
                    token = newToken.newAccessToken;
                    console.log('Az accessToken frissítve.');
                } else {
                    console.log('Nem sikerült frissíteni az accessToken-t.');
                }
            }
        }

        if (token === null){
            NavigationService.redirectToLogin();
        }

        return token;
    },
}