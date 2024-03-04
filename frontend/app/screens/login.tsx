import React, {JSX, useRef} from 'react';
import {View, Text, TextInput, Switch} from 'react-native';
import {LoginService} from '../services/login.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouterProps} from '../interfaces/navigation-props';
import {useStore} from '../states/zustand-states';
import {formStylesheet} from '../styles/form.stylesheet';
import {parseZodError} from '../../../shared/services/zod-dto.service';
import {DarkModeService} from '../services/dark-mode.service';
import Vbutton from '../components/Vbutton';
import BackButton from '../components/back-button-component';
import {ZodError} from 'zod';
import {LoadingService} from '../services/loading.service';
import {
  useFocusTimer,
  useLoginState,
  useStoredUsername,
} from '../states/use-login-states';
import Loading from '../components/loading';
import AlertComponent from '../components/alert';
import {useAlert} from '../states/use-alert';

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
  const isFocused = useFocusTimer(storedUsername);
  const passwordInput = useRef<TextInput | null>(null);
  const {loading, setLoadingState} = LoadingService.useLoading();
  const {setId, setRefreshToken, setAccessToken, setIsLoggedIn} =
    useStore.getState();
  const {isDarkMode} = DarkModeService.useDarkMode();
  const {showAlert, errorMessage, showError, hideError} = useAlert();

  const handleFormSubmit = async () => {
    try {
      setLoadingState(true);
      const {isValid, error} = (await LoginService.validateForm({
        name: username,
        pw: password,
      })) as {isValid: boolean; error: ZodError};

      if (!isValid) {
        const msg = await parseZodError(error);
        return showError(msg);
      }

      const loginSuccess = await LoginService.handleSubmit({
        name: username,
        pw: password,
      });

      if (loginSuccess === undefined) {
        return showError('Hibás felhasználónév vagy jelszó!');
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
    return <Loading isDarkModeOn={isDarkMode} />;
  }

  return (
    <View
      style={
        isDarkMode
          ? formStylesheet.darkContainer
          : formStylesheet.lightContainer
      }>
      {showAlert && errorMessage && (
        <AlertComponent
          type="error"
          title={'Hibás belépés!'}
          message={errorMessage}
          onClose={hideError}
        />
      )}
      <View style={formStylesheet.form}>
        <Text style={formStylesheet.label}>Felhasználónév</Text>
        <TextInput
          autoFocus={isFocused && !storedUsername}
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
          autoFocus={isFocused && !!storedUsername}
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
            trackColor={{false: '#c4c2c2', true: '#8f8b8b'}}
            thumbColor={'#000000'}
            onValueChange={setRememberMe}
            value={rememberMe}
          />
          <Text style={formStylesheet.label}>Emlékezz rám</Text>
        </View>
        <Vbutton
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
