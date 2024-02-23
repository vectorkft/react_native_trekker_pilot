import AsyncStorage from '@react-native-async-storage/async-storage';
import {Errors} from "../interfaces/login-errors";
import {RequestinitFactory} from "../factory/requestinit-factory";
import {tokenHandlingService} from "./token-handling.service";
import {
    UserLoginDTOInput,
    UserLoginDTOOutput,
    ZUserLoginDTOInput,
    ZUserLoginDTOOutput
} from "../dto/user-login.dto";
import {zParse} from "./zod-dto.service";

export const LoginService = {

    loadUsernameAndRememberMe : async () => {
        const [savedUsername, savedRememberMe] = await AsyncStorage.multiGet(['username','rememberMe']);
        return {
            username: savedUsername[1] ? savedUsername[1] : '',
            rememberMe: savedRememberMe[1] ? JSON.parse(savedRememberMe[1]) : false,
        };
    },


    validateForm : (input: ZUserLoginDTOInput) => {
        let errors: Errors = {};

        if (!input.name) {
            errors.username = 'A felhasználónév megadása kötelező!';
        }
        if (!input.pw) {
            errors.password = 'A jelszó megadása kötelező!';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        };
    },

    handleSubmit : async (input: ZUserLoginDTOInput): Promise<ZUserLoginDTOOutput> => {

        const options = {
            method: 'POST',
            body: JSON.stringify({
                "name": input.name,
                "pw": input.pw,
            }),
        };

        try {
            const result = await RequestinitFactory.doRequest('/login',options);

            if (result.status === 200) {
                try {
                    const body : ZUserLoginDTOInput = await zParse(UserLoginDTOInput, JSON.parse(options.body));
                    const output : ZUserLoginDTOOutput = await zParse(UserLoginDTOOutput, result);
                    console.log('Sikeres bejelentkezés!');
                    return output;
                } catch (error){
                    console.log('Hiba:', error);
                }
            } else {
                console.log('Sikertelen bejelentkezés!', result.message);
                return undefined;
            }
        } catch (error: any) {
            console.log('Hiba történt!', 'Az API nem elérhető.');
        }
    },

    handleLogout : async () => {
        const options = {
            method: 'GET',
            accessToken: await tokenHandlingService.getTokenIfValid()
        };

        try {
            const result = await RequestinitFactory.doRequest('/logout', options);

            if(result.status === 200) {
                console.log('Sikeres kijelentkezés!');
                return true;
            } else {
                console.log('Sikertelen kijelentkezés!', result.message);
                return false;
            }
        } catch (error: any) {
            console.log('Hiba történt!', 'Az API nem elérhető.', error);
        }
    },
};

