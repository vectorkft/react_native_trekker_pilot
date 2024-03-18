import {useStore} from '../states/zustand-states';
import React from 'react';
import {NavigationContainerRef} from '@react-navigation/native';

export const navigationRef = React.createRef<NavigationContainerRef>();

const navigate = (routeName: string, params: any = {}) => {
  navigationRef.current?.navigate(routeName, params);
};

export const NavigationService = {
  redirectToLogin: () => {
    const {setIsLoggedIn} = useStore.getState();

    setIsLoggedIn(false);
    navigate('login', {hideBackButton: true});
  },
};
