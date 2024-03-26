import React, {JSX, useContext, useEffect} from 'react';
import {View} from 'react-native';
import {useStore} from '../states/zustand';
import {ProfileService} from '../services/profile';
import {AppNavigation} from '../interfaces/navigation';
import LoadingScreen from './loading-screen';
import VInternetToast from '../components/Vinternet-toast';
import VToast from '../components/Vtoast';
import Header from './header';
import {DarkModeContext} from '../providers/dark-mode';
import {LoadingContext} from '../providers/loading';
import {ToastTypes} from '../enums/types';
import {profileScreen} from '../styles/profile-screen';
import {ErrorContext} from '../providers/error';

const Profile = ({navigation}: AppNavigation): JSX.Element => {
  const {setWasDisconnected} = useStore.getState();
  const isConnected = useStore(state => state.isConnected);
  const wasDisconnected = useStore(state => state.wasDisconnected);
  const {loading, setLoadingState} = useContext(LoadingContext);
  const {isDarkMode} = useContext(DarkModeContext);
  const {setError} = useContext(ErrorContext);

  useEffect(() => {
    let cancelled = false;
    setLoadingState(true);
    ProfileService.handleUserProfileRequest(setError).then(() => {
      if (!cancelled) {
        setLoadingState(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={profileScreen(isDarkMode).mainContainer}>
      <Header navigation={navigation} />
      <VInternetToast isVisible={!isConnected} />
      <VToast
        isVisible={wasDisconnected && isConnected}
        label={'Sikeres kapcsolat!'}
        type={ToastTypes.success}
        handleEvent={() => setWasDisconnected(false)}
      />
    </View>
  );
};

export default Profile;
