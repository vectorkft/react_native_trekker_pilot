import React, {useContext} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {RouterProps} from '../interfaces/navigation-props';
import {useStore} from '../states/zustand-states';
import VbackButton from '../components/Vback-button';
import {RouteProp, useRoute} from '@react-navigation/native';
import {StackParamList} from '../interfaces/stack-param-list';
import {LoginService} from '../services/login.service';
import LoadingScreen from './loading-screen';
import {useAlert} from '../states/use-alert';
import Valert from '../components/Valert';
import {HeaderStylesheet} from '../styles/header.stylesheet';
import {DarkModeContext} from '../providers/dark-mode';
import {LoadingContext} from '../providers/loading';

const Header = ({navigation}: RouterProps) => {
  const {isDarkMode} = useContext(DarkModeContext);
  const {isConnected, setIsLoggedIn} = useStore.getState();
  const {loading, setLoadingState} = useContext(LoadingContext);
  const {errorMessage, setErrorMessage} = useAlert();
  const routeHomeScreen = useRoute<RouteProp<StackParamList, 'homescreen'>>();
  const routeProfile = useRoute<RouteProp<StackParamList, 'profile'>>();
  const hidebutton =
    routeHomeScreen.params.hidebutton || routeProfile.params.hidebutton;
  const hideButtonProfile = routeProfile.params.hideButtonProfile;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View
      style={[
        HeaderStylesheet.header,
        {backgroundColor: isDarkMode ? '#2d2d2d' : '#d2cfcf'},
      ]}>
      {errorMessage && (
        <Valert type="error" title={'Hiba!'} message={errorMessage} />
      )}
      <View style={HeaderStylesheet.iconContainer}>
        {!hideButtonProfile && (
          <TouchableOpacity
            style={HeaderStylesheet.iconButton}
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
            style={HeaderStylesheet.iconButton}
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
      {!hidebutton && <VbackButton navigation={navigation} />}
    </View>
  );
};

export default Header;
