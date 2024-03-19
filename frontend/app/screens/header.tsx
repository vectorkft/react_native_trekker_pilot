import React, {useContext} from 'react';
import {View, TouchableOpacity} from 'react-native';
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

const Header = ({navigation}: AppNavigation) => {
  const {isDarkMode} = useContext(DarkModeContext);
  const {isConnected, setIsLoggedIn} = useStore.getState();
  const {loading, setLoadingState} = useContext(LoadingContext);
  const {errorMessage, setErrorMessage} = useAlert();
  const routeHomeScreen = useRoute<RouteProp<UIConfig, 'homescreen'>>();
  const routeProfile = useRoute<RouteProp<UIConfig, 'profile'>>();
  const hidebutton =
    routeHomeScreen.params.hidebutton || routeProfile.params.hidebutton;
  const hideButtonProfile = routeProfile.params.hideButtonProfile;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View
      style={[
        headerStylesheet.header,
        {backgroundColor: isDarkMode ? '#2d2d2d' : '#d2cfcf'},
      ]}>
      {errorMessage && (
        <VAlert type="error" title={'Hiba!'} message={errorMessage} />
      )}
      <View style={headerStylesheet.iconContainer}>
        {!hideButtonProfile && (
          <TouchableOpacity
            style={headerStylesheet.iconButton}
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
              color={isDarkMode ? '#fff' : '#000'}
              size={35}
            />
          </TouchableOpacity>
        )}
        {!hidebutton && (
          <TouchableOpacity
            style={headerStylesheet.iconButton}
            disabled={!isConnected}
            onPress={async () => {
              setLoadingState(true);
              const logoutSuccess = await LoginService.handleLogout();
              if (logoutSuccess) {
                setIsLoggedIn(false);
                setLoadingState(false);
                navigation.navigate('login');
                return 'Sikeres kijelentkezés!';
              } else {
                setLoadingState(false);
                setErrorMessage('Sikertelen kijelentkezés');
              }
            }}>
            <Icon
              name="exit-to-app"
              type="material"
              color={isDarkMode ? '#fff' : '#000'}
              size={35}
            />
          </TouchableOpacity>
        )}
      </View>
      {!hidebutton && <VBackButton navigation={navigation} />}
    </View>
  );
};

export default Header;
