import { navigationRef } from '../App';
import {useStore} from "../states/states";

const navigate = (routeName: string, params: any = {}) => {
    navigationRef.current?.navigate(routeName, params);
}

export const NavigationService = {
    redirectToLogin: () => {
        const { setIsLoggedIn } = useStore.getState();

        setIsLoggedIn(false);
        navigate('login', { hideBackButton: true });
    },
}