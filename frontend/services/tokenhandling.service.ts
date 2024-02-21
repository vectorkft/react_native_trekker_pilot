import {useStore} from "../states/state";
import jwtDecode from 'jwt-decode';
import {API_URL} from "../config";
import { useNavigation } from '@react-navigation/native';

interface DecodedToken {
    exp: number;
}

export const tokenhandlingService = () => {
    const navigation = useNavigation();

    const isTokenExpired = (token: string | null): boolean => {
        if (!token) {
            return true;
        }

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
            return false;
        }
    };


    const checkAccessToken = async () => {
        const { accessToken, setIsLoggedIn } = useStore.getState();

        if (!accessToken) {
            setIsLoggedIn(false);
            navigation.reset({
                index: 0,
                routes: [{ name: 'login' }],
            });
            console.log('Nincs accessToken.');
            return false;
        }

        return isTokenExpired(accessToken);
    };

    const checkRefreshToken = async () => {
        const { refreshToken, setIsLoggedIn } = useStore.getState();

        if (!refreshToken) {
            console.log('Nincs refreshToken.');
            setIsLoggedIn(false);
            navigation.reset({
                index: 0,
                routes: [{ name: 'login' }],
            });
            return false;
        }

        return isTokenExpired(refreshToken);
    };

    const refreshAccessToken = async () => {
        const { refreshToken, setAccessToken, setIsLoggedIn } = useStore.getState();

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "refreshToken": refreshToken
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        try {
            const response = await fetch(`${API_URL}/refresh`, requestOptions);
            const result = await response.json();

            if (result.newAccessToken) {
                setAccessToken(result.newAccessToken); // Frissítjük az accessToken-t
                return true;
            } else {
                setIsLoggedIn(false);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'login' }],
                });
                return false;
            }
        } catch (error) {
            console.log('Hiba történt az API hívás során:', error.message);
            return false;
        }
    };

    const isTokenValid = async () => {
        const isAccessTokenValid = await checkAccessToken();
        let success = false;

        if (!isAccessTokenValid) {
            const isRefreshTokenValid = await checkRefreshToken();

            if (isRefreshTokenValid) {
                success = true;
                await refreshAccessToken();
            } else {
                success = false;
            }
        }

        return success;
    };

    const getTokenIfValid = async (): Promise<string> => {
        const { accessToken } = useStore.getState();
        const isAccessTokenValid = await checkAccessToken();
        let token: string = null;

        if (isAccessTokenValid) {
            token = accessToken;
            console.log('Az accessToken még érvényes.');
        } else {
            const isRefreshTokenValid = await checkRefreshToken();

            if (isRefreshTokenValid) {
                const success = await refreshAccessToken();
                if (success) {
                    console.log('Az accessToken frissítve.');
                    const { accessToken: newAccessToken } = useStore.getState();
                    token = newAccessToken;
                } else {
                    console.log('Nem sikerült frissíteni az accessToken-t.');
                }
            }
        }

        return token;
    };


    return {
        getTokenIfValid,
        isTokenValid,
        refreshAccessToken,
        checkRefreshToken,
        checkAccessToken,
    };
}