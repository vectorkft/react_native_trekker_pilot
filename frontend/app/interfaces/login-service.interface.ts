import {Errors} from "./login-errors";

export interface LoginServiceInterface {
    loginService: {
        setIsLoggedIn: (isLoggedIn: boolean) => void;
        loadUsernameAndRememberMe: () => Promise<{ username: string, rememberMe: boolean }>;
        validateForm: (username: string, password: string) => { isValid: boolean, errors: Errors };
        handleSubmit: (username: string, password: string) => Promise<boolean>;
        handleLogout: () => void;
    };
}