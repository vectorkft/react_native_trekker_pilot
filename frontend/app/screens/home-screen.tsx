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
      {isLoggedIn ? (
        <View>
          <Vbutton
            label="Profil"
            enabled={true}
            isDarkModeOn={isDarkMode}
            onClick={() => navigation.navigate('profile')}
          />
          <Vbutton
            label="Kijelentkezés"
            enabled={true}
            isDarkModeOn={isDarkMode}
            onClick={handleLogout}
          />
        </View>
      ) : (
        <Vbutton
          label="Bejelentkezés"
          enabled={true}
          isDarkModeOn={isDarkMode}
          onClick={() => navigation.navigate('login')}
        />
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
