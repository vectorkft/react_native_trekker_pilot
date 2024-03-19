import React, {JSX, useContext, useEffect} from 'react';
import {View} from 'react-native';
import {useStore} from '../states/zustand';
import {ProfileService} from '../services/profile';
import {AppNavigation} from '../interfaces/navigation';
import {darkModeContent} from '../styles/dark-mode-content';
import LoadingScreen from './loading-screen';
import VInternetToast from '../components/Vinternet-toast';
import VToast from '../components/Vtoast';
import Header from './header';
import {DarkModeContext} from '../providers/dark-mode';
import {LoadingContext} from '../providers/loading';

const Profile = ({navigation}: AppNavigation): JSX.Element => {
  const {setWasDisconnected} = useStore.getState();
  const isConnected = useStore(state => state.isConnected);
  const wasDisconnected = useStore(state => state.wasDisconnected);
  const {loading, setLoadingState} = useContext(LoadingContext);
  const {isDarkMode} = useContext(DarkModeContext);

  useEffect(() => {
    let cancelled = false;
    setLoadingState(true);
    ProfileService
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
          ? {...darkModeContent.darkContainer, alignItems: 'center'}
          : {...darkModeContent.lightContainer, alignItems: 'center'}
      }>
      <Header navigation={navigation} />
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
