import {useStore} from "../states/states";
import jwtDecode from 'jwt-decode';
import {DecodedToken} from '../interfaces/decoded-token';
import {RequestinitFactory} from "../factory/requestinit-factory";
import {parseZodError, zParse} from "../../../shared/services/zod-dto.service";
import {TokenDTOInput, TokenDTOOutput, ZTokenDTOInput, ZTokenDTOOutput} from "../dto/token.dto";
import {NavigationService} from "./navigation.service";
import {ValidateForm} from "../interfaces/validate-form";

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

const validateBody = async (formData: ZTokenDTOInput): Promise<ValidateForm> => {
    try {
        const body : ZTokenDTOInput = await zParse(TokenDTOInput, formData);
        console.log(body);
    } catch (error) {
        console.log(error);
        return {
            isValid: false,
            error,
        };
    }

    return {
        error : null,
        isValid: true,
    };
}

const refreshAccessToken = async (input: ZTokenDTOInput) : Promise<ZTokenDTOOutput> => {
    const options = {
        method: 'POST',
        body: JSON.stringify(input),
    };

    try {
        const result = await RequestinitFactory.doRequest('/refresh', options);

        if(result.status === 200){
            try {
                const parsedToken : ZTokenDTOOutput = await zParse(TokenDTOOutput, result);
                console.log('New Valid Token Generated');
                return parsedToken;
            } catch (error){
                console.log('Hiba: ', error);
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
                const { isValid, error } = await validateBody({refreshToken: refreshToken})
                if (isValid) {
                    const newToken = await refreshAccessToken({refreshToken: refreshToken});
                    if (newToken) {
                        setAccessToken(newToken.newAccessToken);
                        token = newToken.newAccessToken;
                        console.log('Az accessToken frissítve.');
                    } else {
                        console.log('Nem sikerült frissíteni az accessToken-t.');
                    }
                } else {
                    const msg = await parseZodError(error);
                    console.log('Nem valid token!', msg);
                }
            }
        }

        if (token === null){
            NavigationService.redirectToLogin();
        }

        return token;
    },
}