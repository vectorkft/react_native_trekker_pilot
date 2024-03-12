import React, {JSX, useEffect} from 'react';
import {View} from 'react-native';
import {useStore} from '../states/zustand-states';
import {profileService} from '../services/profile.service';
import {RouterProps} from '../interfaces/navigation-props';
import {LoginService} from '../services/login.service';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import {DarkModeProviderService} from '../services/context-providers.service';
import VButton from '../components/VButton';
import VBackButton from '../components/VBackButton';
import {LoadingProviderService} from '../services/context-providers.service';
import LoadingScreen from './loading-screen';
import VInternetToast from '../components/VInternetToast';
import VToast from '../components/VToast';

const Profile = ({navigation}: RouterProps): JSX.Element => {
  const {setIsLoggedIn, isLoggedIn} = useStore.getState();
  const isConnected = useStore(state => state.isConnected);
  const wasDisconnected = useStore(state => state.wasDisconnected);
  const {loading, setLoadingState} = LoadingProviderService.useLoading();
  const {isDarkMode} = DarkModeProviderService.useDarkMode();

  useEffect(() => {
    let cancelled = false;
    setLoadingState(true);
    profileService
      .handleUserProfileRequest()
      .then(() => {
        if (!cancelled) {
          setLoadingState(false);
        }
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    setLoadingState(true);
    const logoutSuccess = await LoginService.handleLogout();
    if (logoutSuccess) {
      setIsLoggedIn(false);
      navigation.navigate('login');
      setLoadingState(false);
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
      <VBackButton navigation={navigation} />
      {isLoggedIn && (
        <View>
          <View>
            <VButton
              buttonPropsNativeElement={{
                title: 'Cikkek',
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
                onPress: () => navigation.navigate('articles'),
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

export default Profile;
