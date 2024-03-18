import React, {JSX, useContext, useEffect} from 'react';
import {View} from 'react-native';
import {useStore} from '../states/zustand-states';
import {profileService} from '../services/profile.service';
import {RouterProps} from '../interfaces/navigation';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import LoadingScreen from './loading-screen';
import VinternetToast from '../components/Vinternet-toast';
import Vtoast from '../components/Vtoast';
import Header from './header';
import {DarkModeContext} from '../providers/dark-mode';
import {LoadingContext} from '../providers/loading';

const Profile = ({navigation}: RouterProps): JSX.Element => {
  const {setWasDisconnected} = useStore.getState();
  const isConnected = useStore(state => state.isConnected);
  const wasDisconnected = useStore(state => state.wasDisconnected);
  const {loading, setLoadingState} = useContext(LoadingContext);
  const {isDarkMode} = useContext(DarkModeContext);

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
          ? {...darkModeContent.darkContainer, alignItems: 'center'}
          : {...darkModeContent.lightContainer, alignItems: 'center'}
      }>
      <Header navigation={navigation} />
      <VinternetToast isVisible={!isConnected} />
      <Vtoast
        isVisible={wasDisconnected && isConnected}
        label={'Sikeres kapcsolat!'}
        type={'check'}
        handleEvent={() => setWasDisconnected(false)}
      />
    </View>
  );
};

export default Profile;
