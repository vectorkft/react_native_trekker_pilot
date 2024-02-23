import AsyncStorage from '@react-native-async-storage/async-storage';
import {Errors} from "../interfaces/login-errors";
import {RequestinitFactory} from "../factory/requestinit-factory";
import {tokenHandlingService} from "./token-handling.service";

export const LoginService = {

    loadUsernameAndRememberMe : async () => {
        const savedUsername = await AsyncStorage.getItem('username');
        const savedRememberMe = await AsyncStorage.getItem('rememberMe');
        return {
            username: savedUsername ? savedUsername : '',
            rememberMe: savedRememberMe ? JSON.parse(savedRememberMe) : false,
        };
    },

    validateForm : (username: string, password: string) => {
        let errors: Errors = {};

        if (!username) {
            errors.username = 'A felhasználónév megadása kötelező!';
        }
        if (!password) {
            errors.password = 'A jelszó megadása kötelező!';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        };
    },

    handleSubmit : async (username: string, password: string) => {
        const options = {
            method: 'POST',
            body: JSON.stringify({
                "name": username,
                "pw": password
            }),
        };

        try {
            const result = await RequestinitFactory.doRequest('/login',options);

            if (result.status === 200) {
                console.log('Sikeres bejelentkezés!');
                return result;
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

