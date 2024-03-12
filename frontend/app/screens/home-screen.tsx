import React, {JSX} from 'react';
import {View} from 'react-native';
import {useStore} from '../states/zustand-states';
import {LoginService} from '../services/login.service';
import {DarkModeProviderService} from '../services/context-providers.service';
import {RouterProps} from '../interfaces/navigation-props';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import VButton from '../components/VButton';
import {LoadingProviderService} from '../services/context-providers.service';
import LoadingScreen from './loading-screen';
import VToast from '../components/VToast';
import VInternetToast from '../components/VInternetToast';

const HomeScreen = ({navigation}: RouterProps): JSX.Element => {
  const isLoggedIn = useStore(state => state.isLoggedIn);
  const isConnected = useStore(state => state.isConnected);
  const wasDisconnected = useStore(state => state.wasDisconnected);
  const {setIsLoggedIn} = useStore.getState();
  const {isDarkMode} = DarkModeProviderService.useDarkMode();
  const {loading, setLoadingState} = LoadingProviderService.useLoading();

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
      <VInternetToast isVisible={!isConnected} />
      <VToast
        isVisible={wasDisconnected && isConnected}
        label={'Sikeres kapcsolat!'}
        type={'check'}
      />
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
                disabled: !isConnected,
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
                disabled: !isConnected,
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
