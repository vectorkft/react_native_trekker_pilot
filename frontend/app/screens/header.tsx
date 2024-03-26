import React, {useContext} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {AppNavigation} from '../interfaces/navigation';
import {useStore} from '../states/zustand';
import VBackButton from '../components/Vback-button';
import {RouteProp, useRoute} from '@react-navigation/native';
import {UIConfig} from '../interfaces/u-i-config';
import {LoginService} from '../services/login';
import LoadingScreen from './loading-screen';
import {useAlert} from '../states/use-alert';
import VAlert from '../components/Valert';
import {headerStylesheet} from '../styles/header';
import {DarkModeContext} from '../providers/dark-mode';
import {LoadingContext} from '../providers/loading';
import {AlertTypes} from '../enums/types';
import {colors} from '../enums/colors';
import {ErrorContext} from '../providers/error';

const Header = ({navigation}: AppNavigation) => {
  const {isDarkMode} = useContext(DarkModeContext);
  const {setError} = useContext(ErrorContext);
  const {isConnected, setIsLoggedIn} = useStore.getState();
  const {loading, setLoadingState} = useContext(LoadingContext);
  const {errorMessage, setErrorMessage} = useAlert();
  const routeHomeScreen = useRoute<RouteProp<UIConfig, 'homescreen'>>();
  const routeProfile = useRoute<RouteProp<UIConfig, 'profile'>>();
  const hideButton =
    routeHomeScreen.params.hidebutton || routeProfile.params.hidebutton;
  const hideButtonProfile = routeProfile.params.hideButtonProfile;

  const handleLogoutSuccess = () => {
    setIsLoggedIn(false);
    setLoadingState(false);
    navigation.navigate('login');
  };

  const handleLogoutError = () => {
    setLoadingState(false);
    setErrorMessage('Sikertelen kijelentkezés');
    return;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={headerStylesheet(isDarkMode).header}>
      {errorMessage && (
        <VAlert
          type={AlertTypes.error}
          title={'Hiba!'}
          message={errorMessage}
        />
      )}
      <View style={headerStylesheet().iconContainer}>
        {!hideButtonProfile && (
          <TouchableOpacity
            style={headerStylesheet().iconButton}
            disabled={!isConnected}
            onPress={() =>
              navigation.navigate('profile', {
                hidebutton: false,
                hideButtonProfile: true,
              })
            }>
            <Icon
              name="user"
              type="font-awesome"
              color={isDarkMode ? colors.lightContent : colors.darkContent}
              size={35}
            />
          </TouchableOpacity>
        )}
        {!hideButton && (
          <TouchableOpacity
            style={headerStylesheet().iconButton}
            disabled={!isConnected}
            onPress={async () => {
              setLoadingState(true);
              await LoginService.handleLogout(
                handleLogoutSuccess,
                handleLogoutError,
                setError,
              );
            }}>
            <Icon
              name="exit-to-app"
              type="material"
              color={isDarkMode ? colors.lightContent : colors.darkContent}
              size={35}
            />
          </TouchableOpacity>
        )}
      </View>
      {!hideButton && <VBackButton navigation={navigation} />}
    </View>
  );
};

export default Header;
