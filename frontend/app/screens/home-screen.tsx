import React, {JSX} from 'react';
import {View, Text, Switch} from 'react-native';
import {useStore} from '../states/zustand-states';
import {LoginService} from '../services/login.service';
import {DarkModeService} from '../services/dark-mode.service';
import {RouterProps} from '../interfaces/navigation-props';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import Vbutton from '../components/Vbutton';
import {LoadingService} from '../services/loading.service';
import Loading from '../components/loading';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const HomeScreen = ({navigation}: RouterProps): JSX.Element => {
  const isLoggedIn = useStore(state => state.isLoggedIn);
  const {setIsLoggedIn} = useStore.getState();
  const {isDarkMode, toggleDarkMode} = DarkModeService.useDarkMode();
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
    return <Loading isDarkModeOn={isDarkMode} />;
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
          <Vbutton
            buttonProps={{
              title: 'Profil',
              onPress: () => navigation.navigate('profile'),
              color: isDarkMode ? Colors.lighter : Colors.darker,
            }}
          />
          <Vbutton
            buttonProps={{
              title: 'Kijelentkezés',
              onPress: handleLogout,
              color: isDarkMode ? Colors.lighter : Colors.darker,
            }}
          />
        </View>
      )}
      <View style={darkModeContent.switchMode}>
        <Text
          style={
            isDarkMode
              ? darkModeContent.darkModeText
              : darkModeContent.lightModeText
          }>
          Sötét mód
        </Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleDarkMode}
          value={isDarkMode}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
