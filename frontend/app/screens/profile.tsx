import React, {JSX, useEffect, useState} from 'react';
import {View, Text, Switch} from 'react-native';
import {useStore} from '../states/zustand-states';
import {profileService} from '../services/profile.service';
import {RouterProps} from '../interfaces/navigation-props';
import {LoginService} from '../services/login.service';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import {ProfileData} from '../interfaces/profile-data';
import {DarkModeService} from '../services/dark-mode.service';
import Vbutton from '../components/Vbutton';
import BackButton from '../components/back-button-component';
import {LoadingService} from '../services/loading.service';
import Loading from '../components/loading';
import {Colors} from "react-native/Libraries/NewAppScreen";

const Profile = ({navigation}: RouterProps): JSX.Element => {
  const {setIsLoggedIn, isLoggedIn} = useStore.getState();
  const [profileData, setProfileData] = useState<ProfileData | Response>();
  const {loading, setLoadingState} = LoadingService.useLoading();
  const {isDarkMode, toggleDarkMode} = DarkModeService.useDarkMode();

  useEffect(() => {
    let cancelled = false;
    setLoadingState(true);
    profileService
      .handleUserProfileRequest()
      .then(profile => {
        if (!cancelled) {
          setProfileData(profile);
          setLoadingState(false);
        }
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setProfileData]);

  if (loading) {
    return <Loading isDarkModeOn={isDarkMode} />;
  }
  const handleLogout = async () => {
    setLoadingState(true);
    const logoutSuccess = await LoginService.handleLogout();
    if (logoutSuccess) {
      setIsLoggedIn(false);
      navigation.navigate('homescreen');
      setLoadingState(false);
      return 'Sikeres kijelentkezés!';
    }
  };

  return (
    <View
      style={
        isDarkMode
          ? darkModeContent.darkContainer
          : darkModeContent.lightContainer
      }>
      {isLoggedIn && (
        <View style={{alignItems: 'center'}}>
          {profileData && 'username' in profileData && (
            <Text
              style={
                isDarkMode
                  ? darkModeContent.lightTitle
                  : darkModeContent.darkTitle
              }>
              Üdvözöllek a profilon {profileData.username}!
            </Text>
          )}
          <Vbutton
              buttonProps={{
                title: 'Kijelentkezés',
                onPress: handleLogout,
                color: isDarkMode? Colors.black : Colors.white,
              }}
          />
          <Vbutton
              buttonProps={{
                title: 'Cikkek',
                onPress: () => navigation.navigate('articles'),
                color: isDarkMode? Colors.black : Colors.white,
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
      <BackButton navigation={navigation} />
    </View>
  );
};

export default Profile;
