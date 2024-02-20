import {Alert} from "react-native";
import {useStore} from "../states/state";
import jwtDecode from 'jwt-decode';
import {API_URL} from "../config";
import { useNavigation } from '@react-navigation/native';

interface DecodedToken {
    exp: number;
}

export const tokenhandlingService = () => {
    const { accessToken, refreshToken } = useStore.getState();
    const navigation = useNavigation();

    const getAccessToken = () =>{
        Alert.alert(accessToken)
    }

    const getRefreshToken = () =>{
        Alert.alert(refreshToken)
    }

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

        try {
            const decoded: DecodedToken = jwtDecode(accessToken);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                console.log('Az accessToken lejárt.');
                return false;
            } else {
                console.log('Az accessToken érvényes.');
                return true;
            }
        } catch (error) {
            console.log('Hiba a token dekódolása közben:', error.message);
            return false;
        }
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

        const decodedRefreshToken: DecodedToken = jwtDecode(refreshToken);
        const currentTime = Date.now() / 1000;

        if (decodedRefreshToken.exp < currentTime) {
            console.log('A refreshToken is lejárt.');
            setIsLoggedIn(false);
            navigation.reset({
                index: 0,
                routes: [{ name: 'login' }],
            });
            return false;
        }

        return true;
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
                console.log('Az accessToken frissítve.');
                return true;
            } else {
                console.log('Nem sikerült frissíteni az accessToken-t.');
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

    const getNewToken = async () => {
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

    return {
        getNewToken,
        refreshAccessToken,
        checkRefreshToken,
        getAccessToken,
        getRefreshToken,
        checkAccessToken,
    };
}