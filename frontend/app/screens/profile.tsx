import React, {JSX, useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {useStore} from '../states/zustand-states';
import {profileService} from '../services/profile.service';
import {RouterProps} from '../interfaces/navigation-props';
import {LoginService} from '../services/login.service';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import {ProfileData} from '../interfaces/profile-data';
import {DarkModeService} from '../services/dark-mode.service';
import VButton from '../components/VButton';
import VBackButton from '../components/VBackButton';
import {LoadingService} from '../services/loading.service';
import VLoading from '../components/VLoading';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const Profile = ({navigation}: RouterProps): JSX.Element => {
  const {setIsLoggedIn, isLoggedIn} = useStore.getState();
  const [profileData, setProfileData] = useState<ProfileData | Response>();
  const {loading, setLoadingState} = LoadingService.useLoading();
  const {isDarkMode} = DarkModeService.useDarkMode();

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
    return <VLoading isDarkModeOn={isDarkMode} />;
  }
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

  return (
    <View
      style={
        isDarkMode
          ? darkModeContent.darkContainer
          : darkModeContent.lightContainer
      }>
      {isLoggedIn && (
        <View>
          {profileData && 'username' in profileData && (
            <View>
              <Text
                style={
                  isDarkMode
                    ? darkModeContent.lightTitle
                    : darkModeContent.darkTitle
                }>
                Üdvözöllek a profilon {profileData.username}!
              </Text>
            </View>
          )}
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
                  marginTop: 15,
                  borderRadius: 10,
                  width: '60%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                },
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
                  textAlign: 'center',
                },
                buttonStyle: {
                  backgroundColor: '#00EDAE',
                  height: 50,
                  marginBottom: 15,
                  borderRadius: 10,
                  width: '60%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                },
                onPress: handleLogout,
              }}
            />
          </View>
        </View>
      )}
      <VBackButton navigation={navigation} />
    </View>
  );
};

export default Profile;
