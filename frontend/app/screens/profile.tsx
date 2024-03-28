import React, {JSX, useContext, useEffect} from 'react';
import {View} from 'react-native';
import {ProfileService} from '../services/profile';
import {AppNavigation} from '../interfaces/navigation';
import Header from './header';
import {DarkModeContext} from '../providers/dark-mode';
import {LoadingContext} from '../providers/loading';
import {profileScreen} from '../styles/profile-screen';
import {ErrorContext} from '../providers/error';
import LoadingScreen from './loading-screen';
import withNetInfo from '../components/with-net-info';

const Profile = ({navigation}: AppNavigation): JSX.Element => {
  const {loading, setLoadingState} = useContext(LoadingContext);
  const {isDarkMode} = useContext(DarkModeContext);
  const {setError} = useContext(ErrorContext);

  useEffect(() => {
    let cancelled = false;

    setLoadingState(true);
    ProfileService.handleUserProfileRequest(setError).finally(() => {
      if (!cancelled) {
        setLoadingState(false);
      }
    });

    return () => {
      setLoadingState(false);
      cancelled = true;
    };
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : (
    <View style={profileScreen(isDarkMode).mainContainer}>
      <Header navigation={navigation} />
    </View>
  );
};

export default withNetInfo(Profile);
