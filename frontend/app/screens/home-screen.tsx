import React, {JSX} from 'react';
import {View} from 'react-native';
import {useStore} from '../states/zustand-states';
import {LoginService} from '../services/login.service';
import {DarkModeService} from '../services/dark-mode.service';
import {RouterProps} from '../interfaces/navigation-props';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import VButton from '../components/VButton';
import {LoadingService} from '../services/loading.service';
import VLoading from '../components/VLoading';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const HomeScreen = ({navigation}: RouterProps): JSX.Element => {
  const isLoggedIn = useStore(state => state.isLoggedIn);
  const {setIsLoggedIn} = useStore.getState();
  const {isDarkMode} = DarkModeService.useDarkMode();
  const {loading, setLoadingState} = LoadingService.useLoading();

  const handleLogout = async () => {
    setLoadingState(true);
    const logoutSuccess = await LoginService.handleLogout();
    if (logoutSuccess) {
      setIsLoggedIn(false);
      setLoadingState(false);
      navigation.navigate('login');
      return 'Sikeres kijelentkezés!';
    }
  };

  if (loading) {
    return <VLoading isDarkModeOn={isDarkMode} />;
  }

  return (
    <View
      style={
        isDarkMode
          ? darkModeContent.darkContainer
          : darkModeContent.lightContainer
      }>
      {isLoggedIn && (
        <View>
          <VButton
            buttonProps={{
              title: 'Profil',
              onPress: () => navigation.navigate('profile'),
              color: isDarkMode ? Colors.lighter : Colors.darker,
            }}
          />
          <VButton
            buttonProps={{
              title: 'Kijelentkezés',
              onPress: handleLogout,
              color: isDarkMode ? Colors.lighter : Colors.darker,
            }}
          />
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
