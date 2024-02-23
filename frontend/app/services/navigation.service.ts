import { navigationRef } from '../App';
import {useStore} from "../states/states";

const navigate = (routeName: string, params: any = {}) => {
    navigationRef.current?.reset({
        index: 0,
        routes: [{ name: routeName, params: params }],
    });
}

export const NavigationService = {
    redirectToLogin: () => {
        const { setIsLoggedIn } = useStore.getState();

        setIsLoggedIn(false);
        navigate('login', null);
    },
}