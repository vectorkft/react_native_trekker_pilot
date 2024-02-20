import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from "react-native";
import {API_URL} from '../config';
import {useStore} from "../states/state";

interface Errors {
    username?: string;
    password?: string;
}

export const useLoginService = () => {
    const { setId, setRefreshToken, setAccessToken, setIsLoggedIn } = useStore.getState();
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
        const myHeaders: Record<string, string> = {
            "Content-Type": "application/json"
        };

        const raw: string = JSON.stringify({
            "name": username,
            "pw": password
        });

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        };

        let response: Response;
        let result: any;
        let loginSuccess = false;

        try {
            response = await fetch(`${API_URL}/login`, requestOptions);
            result = await response.json();

            if (result.message === "Login Succes, token added succesfully") {
                console.log('Sikeres bejelentkezés!');
                setIsLoggedIn(true);
                setAccessToken(result.accessToken);
                setRefreshToken(result.refreshToken);
                setId(result.userId);
                loginSuccess = true;
            }else {
                console.log('Sikertelen bejelentkezés!', result.message);
            }
        } catch (error: any) {
            console.log('Hiba történt!', 'Az API nem elérhető.');
        }
        return loginSuccess;
    };

    const handleLogout = async () => {
        setIsLoggedIn(false);
        console.log('Sikeres kijelentkezés!');
    };

    return {
        setIsLoggedIn,
        loadUsernameAndRememberMe,
        validateForm,
        handleSubmit,
        handleLogout,
    };
};

