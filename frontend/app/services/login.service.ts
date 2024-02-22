import AsyncStorage from '@react-native-async-storage/async-storage';
import {useStore} from "../states/states";
import {Errors} from "../interfaces/login-errors";
import {RequestinitFactory} from "../factory/requestinit-factory";
import {tokenHandlingService} from "./token-handling.service";

export const useLoginService = () => {
    const { setId, setRefreshToken, setAccessToken, setIsLoggedIn } = useStore.getState();
    const tokenService = tokenHandlingService();
    const loadUsernameAndRememberMe = async () => {
        const savedUsername = await AsyncStorage.getItem('username');
        const savedRememberMe = await AsyncStorage.getItem('rememberMe');
        return {
            username: savedUsername ? savedUsername : '',
            rememberMe: savedRememberMe ? JSON.parse(savedRememberMe) : false,
        };
    };

    const validateForm = (username: string, password: string) => {
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
    };

    const handleSubmit = async (username: string, password: string) => {
        let loginSuccess = false;

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
                setIsLoggedIn(true);
                setAccessToken(result.accessToken);
                setRefreshToken(result.refreshToken);
                setId(result.userId);
                loginSuccess = true;
            } else {
                console.log('Sikertelen bejelentkezés!', result.message);
            }
        } catch (error: any) {
            console.log('Hiba történt!', 'Az API nem elérhető.');
        }
        return loginSuccess;
    };

    const handleLogout = async () => {
        const options = {
            method: 'GET',
            accessToken: await tokenService.getTokenIfValid()
        };
        try {
            const result = await RequestinitFactory.doRequest('/logout', options);

            if(result.status === 200) {
                setIsLoggedIn(false);
                console.log('Sikeres kijelentkezés!');
            }else {
                console.log('Sikertelen kijelentkezés!', result.message);
            }
        } catch (error: any) {
            console.log('Hiba történt!', 'Az API nem elérhető.', error);
        }
    };

    return {
        setIsLoggedIn,
        loadUsernameAndRememberMe,
        validateForm,
        handleSubmit,
        handleLogout,
    };
};

