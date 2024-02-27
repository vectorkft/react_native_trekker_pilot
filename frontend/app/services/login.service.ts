import AsyncStorage from '@react-native-async-storage/async-storage';
import {RequestinitFactory} from "../factory/requestinit-factory";
import {tokenHandlingService} from "./token-handling.service";
import {
    UserLoginDTOInput,
    UserLoginDTOOutput,
    ZUserLoginDTOInput,
    ZUserLoginDTOOutput
} from "../dto/user-login.dto";
import {zParse} from "../../../shared/services/zod-dto.service";
import {ValidateForm} from "../interfaces/validate-form";

export const LoginService = {

    loadUsernameAndRememberMe : async () => {
        const [savedUsername, savedRememberMe] = await AsyncStorage.multiGet(['username','rememberMe']);
        return {
            username: savedUsername[1] ? savedUsername[1] : '',
            rememberMe: savedRememberMe[1] ? JSON.parse(savedRememberMe[1]) : false,
        };
    },


    validateForm : async (formData: ZUserLoginDTOInput) : Promise<ValidateForm> => {
        try {
            const body : ZUserLoginDTOInput = await zParse(UserLoginDTOInput, formData);
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
    },

    handleSubmit : async (input: ZUserLoginDTOInput): Promise<ZUserLoginDTOOutput|undefined> => {
        const options = {
            method: 'POST',
            body: JSON.stringify(input),
        };

        try {
            const result = await RequestinitFactory.doRequest('/login',options);

            if (result.status === 200) {
                try {
                    const handleSubmitDTOOutput : ZUserLoginDTOOutput = await zParse(UserLoginDTOOutput, result);
                    console.log('Sikeres bejelentkezés!');
                    return handleSubmitDTOOutput;
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

    handleLogout : async () : Promise<boolean> => {
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

