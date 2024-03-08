import React, {JSX} from 'react';
import {View} from 'react-native';
import {useStore} from '../states/zustand-states';
import {LoginService} from '../services/login.service';
import {DarkModeService} from '../services/dark-mode.service';
import {RouterProps} from '../interfaces/navigation-props';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import VButton from '../components/VButton';
import {LoadingService} from '../services/loading.service';
import LoadingScreen from './loading-screen';

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
    return <LoadingScreen />;
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
          <View>
            <VButton
              buttonPropsNativeElement={{
                title: 'Profil',
                titleStyle: {
                  fontFamily: 'Roboto',
                  fontSize: 20,
                  fontWeight: '700',
                  color: isDarkMode ? '#fff' : '#000',
                  textAlign: 'center',
                },
                buttonStyle: {
                  backgroundColor: '#00EDAE',
                  height: 50,
                  marginBottom: 15,
                  borderRadius: 10,
                  width: '80%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                },
                onPress: () => navigation.navigate('profile'),
              }}
            />
          </View>
          <View>
            <VButton
              buttonPropsNativeElement={{
                title: 'Kijelentkezés',
                titleStyle: {
                  fontFamily: 'Roboto',
                  fontSize: 20,
                  fontWeight: '700',
                  color: isDarkMode ? '#fff' : '#000',
                },
                buttonStyle: {
                  backgroundColor: '#00EDAE',
                  height: 50,
                  marginBottom: 15,
                  borderRadius: 10,
                  width: '80%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                },
                onPress: handleLogout,
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
