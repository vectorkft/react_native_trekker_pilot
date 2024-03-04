import React, {JSX, useEffect, useState} from 'react';
import {View, Text, Switch, ActivityIndicator} from 'react-native';
import {useStore} from '../states/zustand-states';
import {profileService} from '../services/profile.service';
import {RouterProps} from '../interfaces/navigation-props';
import {LoginService} from '../services/login.service';
import {styles} from '../styles/components.stylesheet';
import {ProfileData} from '../interfaces/profile-data';
import {DarkModeService} from '../services/dark-mode.service';
import ButtonComponent from '../components/button-component';
import BackButton from '../components/back-button-component';
import {LoadingService} from '../services/loading.service';

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
  }, [setProfileData]);

  if (loading) {
    return (
      <View style={isDarkMode ? styles.darkContainer : styles.lightContainer}>
        <ActivityIndicator
          size="large"
          color={isDarkMode ? '#ffffff' : '#000000'}
        />
      </View>
    );
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
    <View style={isDarkMode ? styles.darkContainer : styles.lightContainer}>
      {isLoggedIn && (
        <View style={{alignItems: 'center'}}>
          {profileData && 'username' in profileData && (
            <Text style={isDarkMode ? styles.darkTitle : styles.lightTitle}>
              Üdvözöllek a profilon {profileData.username}!
            </Text>
          )}
          <ButtonComponent
            label="Kijelentkezés"
            enabled={isDarkMode}
            onClick={handleLogout}
          />
          <ButtonComponent
            label="Cikkek"
            enabled={isDarkMode}
            onClick={() => navigation.navigate('articles')}
          />
        </View>
      )}
      <View style={styles.switchMode}>
        <Text style={isDarkMode ? styles.darkModeText : styles.lightModeText}>
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
