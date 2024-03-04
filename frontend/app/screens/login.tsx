import React, {JSX, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {LoginService} from '../services/login.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouterProps} from '../interfaces/navigation-props';
import {useStore} from '../states/zustand-states';
import {formStylesheet} from '../styles/form.stylesheet';
import {parseZodError} from '../../../shared/services/zod-dto.service';
import {DarkModeService} from '../services/dark-mode.service';
import ButtonComponent from '../components/button-component';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import BackButton from '../components/back-button-component';
import {ZodError} from 'zod';
import {LoadingService} from '../services/loading.service';
import {
  useLoginState, useStoredUsername,
} from '../states/use-login-states';

const Login = ({navigation}: RouterProps): JSX.Element => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
  } = useLoginState();
  const {storedUsername} = useStoredUsername();
  const passwordInput = useRef<TextInput | null>(null);
  const {loading, setLoadingState} = LoadingService.useLoading();
  const {setId, setRefreshToken, setAccessToken, setIsLoggedIn} =
    useStore.getState();
  const {isDarkMode} = DarkModeService.useDarkMode();


  const handleFormSubmit = async () => {
    try {
      setLoadingState(true);
      const {isValid, error} = (await LoginService.validateForm({
        name: username,
        pw: password,
      })) as {isValid: boolean; error: ZodError};

      if (!isValid) {
        const msg = await parseZodError(error);
        Alert.alert('Hibás belépés!', msg);
        return;
      }

      const loginSuccess = await LoginService.handleSubmit({
        name: username,
        pw: password,
      });

      if (loginSuccess === undefined) {
        Alert.alert(
          'Sikertelen bejelentkezés!',
          'Hibás felhasználónév vagy jelszó!',
        );
        return;
      }

      if (rememberMe) {
        await AsyncStorage.multiSet([
          ['username', username],
          ['rememberMe', JSON.stringify(true)],
        ]);
      } else {
        await AsyncStorage.removeItem('username');
        await AsyncStorage.setItem('rememberMe', JSON.stringify(false));
      }
      setUsername('');
      setPassword('');
      setAccessToken(loginSuccess.accessToken);
      setRefreshToken(loginSuccess.refreshToken);
      setId(loginSuccess.userId);
      setIsLoggedIn(true);
      navigation.navigate('homescreen');
      return 'Sikeres bejelentkezés!';
    } finally {
      setLoadingState(false);
    }
  };

  if (loading) {
    return (
      <View style={isDarkMode ? darkModeContent.darkContainer : darkModeContent.lightContainer}>
        <ActivityIndicator
          size="large"
          color={isDarkMode ? '#ffffff' : '#000000'}
        />
      </View>
    );
  }

  return (
    <View
      style={
        isDarkMode
          ? formStylesheet.darkContainer
          : formStylesheet.lightContainer
      }>
      <View style={formStylesheet.form}>
        <Text style={formStylesheet.label}>Felhasználónév</Text>
        <TextInput
          autoFocus={!storedUsername}
          style={formStylesheet.input}
          placeholder="Add meg a felhasználónevedet"
          placeholderTextColor="grey"
          value={username}
          onChangeText={setUsername}
          onSubmitEditing={() => passwordInput.current?.focus()}
          blurOnSubmit={false}
        />
        <Text style={formStylesheet.label}>Jelszó</Text>
        <TextInput
          autoFocus={!!storedUsername}
          style={formStylesheet.input}
          placeholder="Add meg a jelszavadat"
          placeholderTextColor="grey"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          ref={passwordInput}
          onSubmitEditing={handleFormSubmit}
        />
        <View style={formStylesheet.rememberMe}>
          <Switch
            trackColor={{false: '#c4c2c2', true: '#494949'}}
            thumbColor={'#000000'}
            onValueChange={setRememberMe}
            value={rememberMe}
          />
          <Text style={formStylesheet.label}>Emlékezz rám</Text>
        </View>
        <ButtonComponent
          label="Bejelentkezés"
          enabled={true}
          onClick={handleFormSubmit}
          isDarkModeOn={false}
          optional={true}
        />
      </View>
      <BackButton navigation={navigation} />
    </View>
  );
};

export default Login;
