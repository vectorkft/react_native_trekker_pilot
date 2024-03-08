import React, {JSX, useRef} from 'react';
import {LoginService} from '../services/login.service';
import {RouterProps} from '../interfaces/navigation-props';
import {useStore} from '../states/zustand-states';
import {
  parseZodError,
  validateZDTOForm,
} from '../../../shared/services/zod-dto.service';
import {DarkModeService} from '../services/dark-mode.service';
import {ZodError} from 'zod';
import {LoadingService} from '../services/loading.service';
import {TextInput, View} from 'react-native';
import {useLoginState} from '../states/use-login-states';
import VAlert from '../components/VAlert';
import {useAlert} from '../states/use-alert';
import {CheckBox, Text, Switch} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import VButton from '../components/VButton';
import LoadingScreen from './loading-screen';
import {MMKV} from 'react-native-mmkv';
import {UserLoginDTOInput} from '../../../shared/dto/user-login.dto';
import VInput from '../components/VInput';
const Login = ({navigation}: RouterProps): JSX.Element => {
  const {isDarkMode, toggleDarkMode} = DarkModeService.useDarkMode();
  const {loading, setLoadingState} = LoadingService.useLoading();
  const passwordInput = useRef<TextInput | null>(null);
  const {setId, setRefreshToken, setAccessToken, setIsLoggedIn, isLoggedIn} =
    useStore.getState();
  const {
    username,
    setUsername,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
  } = useLoginState();
  const {errorMessage, setErrorMessage} = useAlert();

  const storage = new MMKV({
    id: 'app',
  });

  const handleFormSubmit = async () => {
    try {
      setLoadingState(true);
      const {isValid, error} = (await validateZDTOForm(UserLoginDTOInput, {
        name: username,
        pw: password,
      })) as {isValid: boolean; error: ZodError};

      if (!isValid) {
        const msg = await parseZodError(error);
        return setErrorMessage(msg);
      }

      const loginSuccess = await LoginService.handleSubmit({
        name: username,
        pw: password,
      });

      if (loginSuccess === undefined) {
        return setErrorMessage('Hibás felhasználónév vagy jelszó!');
      }

      if (rememberMe) {
        storage.set('username', username);
        storage.set('rememberMe', true);
        setUsername(username);
      } else {
        storage.delete('username');
        storage.set('rememberMe', false);
        setUsername('');
      }
      setPassword('');
      setAccessToken(loginSuccess.accessToken);
      setRefreshToken(loginSuccess.refreshToken);
      setId(loginSuccess.userId);
      setIsLoggedIn(true);
      setErrorMessage(null);
      navigation.navigate('homescreen');
      return 'Sikeres bejelentkezés!';
    } finally {
      setLoadingState(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
      }}>
      {errorMessage && (
        <VAlert type="error" title={'Hibás belépés!'} message={errorMessage} />
      )}
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text
          style={{
            fontFamily: 'Roboto',
            fontSize: 30,
            fontWeight: 'bold',
            color: isDarkMode ? 'white' : 'black',
          }}>
          Bejelentkezés
        </Text>
        <View style={{width: '90%'}}>
          <VInput
            inputProps={{
              value: username,
              onChangeText: setUsername,
              autoFocus: isLoggedIn ? false : !username,
              placeholder: 'Felhasználónév',
              onSubmitEditing: () => passwordInput.current?.focus(),
              blurOnSubmit: false,
            }}
          />
          <VInput
            inputProps={{
              ref: passwordInput,
              secureTextEntry: true,
              value: password,
              onChangeText: setPassword,
              autoFocus: isLoggedIn ? false : !!username,
              placeholder: 'Jelszó',
              onSubmitEditing: handleFormSubmit,
            }}
          />
          <CheckBox
            title="Emlékezz rám"
            checkedColor="#00EDAE"
            uncheckedColor={isDarkMode ? 'white' : 'black'}
            containerStyle={{
              backgroundColor: 'transparent',
              borderWidth: 0,
              alignSelf: 'flex-start',
              marginLeft: -8,
            }}
            textStyle={{color: isDarkMode ? 'white' : 'black', fontSize: 15}}
            checked={rememberMe}
            onPress={() => setRememberMe(!rememberMe)}
          />
          <VButton
            buttonPropsNativeElement={{
              title: 'Bejelentkezés',
              titleStyle: {
                fontFamily: 'Roboto',
                fontSize: 20,
                fontWeight: '700',
                color: isDarkMode ? '#fff' : '#000',
              },
              buttonStyle: {
                backgroundColor: '#00EDAE',
                height: 50,
                borderRadius: 10,
              },
              onPress: handleFormSubmit,
              disabled: !username || !password,
            }}
          />
        </View>
      </View>
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
          trackColor={{
            false: isDarkMode ? '#424242' : '#E0E0E0',
            true: '#ffffff',
          }}
          thumbColor={isDarkMode ? '#00EDAE' : '#616161'}
          onValueChange={toggleDarkMode}
          value={isDarkMode}
        />
      </View>
    </View>
  );
};

export default Login;
