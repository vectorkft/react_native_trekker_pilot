import React, {JSX, useEffect} from 'react';
import {View} from 'react-native';
import {useStore} from '../states/zustand-states';
import {profileService} from '../services/profile.service';
import {RouterProps} from '../interfaces/navigation-props';
import {LoginService} from '../services/login.service';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import {DarkModeProviderService} from '../services/context-providers.service';
import {LoadingProviderService} from '../services/context-providers.service';
import LoadingScreen from './loading-screen';
import VInternetToast from '../components/VInternetToast';
import VToast from '../components/VToast';
import Header from "./header";

const Profile = ({navigation}: RouterProps): JSX.Element => {
  const {setIsLoggedIn, setWasDisconnected} = useStore.getState();
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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View
        style={
          isDarkMode
              ? {...darkModeContent.darkContainer,alignItems: 'center'}
              : {...darkModeContent.lightContainer,alignItems: 'center'}
        }>
        <Header navigation={navigation}/>
      <VInternetToast isVisible={!isConnected} />
        <VToast
            isVisible={wasDisconnected && isConnected}
            label={'Sikeres kapcsolat!'}
            type={'check'}
            handleEvent={() => setWasDisconnected(false)}
        />
    </View>
  );
};

export default Profile;
