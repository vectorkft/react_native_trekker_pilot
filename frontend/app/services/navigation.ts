import {useStore} from '../states/zustand';
import React from 'react';
import {NavigationContainerRef} from '@react-navigation/native';

export const navigationRef = React.createRef<NavigationContainerRef>();

export const navigate = (routeName: string, params: any = {}) => {
  navigationRef.current?.navigate(routeName, params);
};

export const NavigationService = {
  redirectToLogin: () => {
    const {setIsLoggedIn} = useStore.getState();

    setIsLoggedIn(false);
    navigate('login', {focus: true});
  },
  redirectBack: () => {
    navigationRef.current?.goBack();
  },
};
