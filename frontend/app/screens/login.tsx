import React, {JSX, useContext, useRef, useState} from 'react';
import {LoginService} from '../services/login.service';
import {RouterProps} from '../interfaces/navigation';
import {useStore} from '../states/zustand-states';
import {
  parseZodError,
  validateZDTOForm,
} from '../../../shared/services/zod-dto.service';
import {ZodError} from 'zod';
import {Image, TextInput, View} from 'react-native';
import {useLoginState} from '../states/use-login-states';
import Valert from '../components/Valert';
import {useAlert} from '../states/use-alert';
import {CheckBox, Text, Switch, Icon} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import Vbutton from '../components/Vbutton';
import LoadingScreen from './loading-screen';
import {UserLoginDTOInput} from '../../../shared/dto/user-login.dto';
import Vinput from '../components/Vinput';
import {useNetInfo} from '../states/use-net-info';
import {LocalStorageService} from '../services/local-storage.service';
import * as Sentry from '@sentry/react-native';
import DeviceInfoList from '../services/device-info.service';
import {DarkModeContext} from '../providers/dark-mode';
import {LoadingContext} from '../providers/loading';

const Login = ({navigation}: RouterProps): JSX.Element => {
  const {isDarkMode, toggleDarkMode} = useContext(DarkModeContext);
  const {loading, setLoadingState} = useContext(LoadingContext);
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {errorMessage, setErrorMessage} = useAlert();
  const {mountConnection} = useNetInfo();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(previousState => !previousState);
  };

  const handleFormSubmit = async () => {
    try {
      setLoadingState(true);

      if (!mountConnection) {
        return setErrorMessage('Ellenőrizd az internetkapcsolatodat!');
      }

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

        if ('error' in loginSuccess && loginSuccess.error === 'Unauthorized') {
        return setErrorMessage('Hibás felhasználónév vagy jelszó!');
      }

      if (rememberMe) {
        LocalStorageService.storeData({username: username, rememberMe: true});
        setUsername(username);
      } else {
        LocalStorageService.deleteData(['username']);
        LocalStorageService.storeData({rememberMe: false});
        setUsername('');
      }
      setPassword('');
      setAccessToken('accessToken' in loginSuccess ? loginSuccess.accessToken : '');
      setRefreshToken('refreshToken' in loginSuccess ? loginSuccess.refreshToken : '');
      setId('userId' in loginSuccess ? loginSuccess.userId : null);
      setIsLoggedIn(true);
      setErrorMessage(null);
      navigation.navigate('homescreen', {hidebutton: true});
      return 'Sikeres bejelentkezés!';
    } catch (e) {
      Sentry.captureException(e);
      throw e;
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
      <DeviceInfoList />
      <Image
        source={require('../../assets/img/header.png')}
        style={{width: '100%', height: 100}}
      />
      {errorMessage && (
        <Valert type="error" title={'Hibás belépés!'} message={errorMessage} />
      )}
      <View style={{flex: 1, alignItems: 'center'}}>
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
          <Vinput
            inputProps={{
              value: username,
              onChangeText: setUsername,
              autoFocus: isLoggedIn ? false : !username,
              placeholder: 'Felhasználónév',
              onSubmitEditing: () => passwordInput.current?.focus(),
              blurOnSubmit: false,
            }}
          />
          <Vinput
            inputProps={{
              ref: passwordInput,
              secureTextEntry: !isPasswordVisible,
              value: password,
              onChangeText: setPassword,
              autoFocus: isLoggedIn ? false : !!username,
              placeholder: 'Jelszó',
              onSubmitEditing: handleFormSubmit,
              rightIcon: (
                <>
                  <Icon
                    onPress={togglePasswordVisibility}
                    type={'material'}
                    name={isPasswordVisible ? 'visibility-off' : 'visibility'}
                    size={24}
                    color={isDarkMode ? '#fff' : '#000'}
                  />
                </>
              ),
            }}
          />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
              textStyle={{color: isDarkMode ? 'white' : 'black', fontSize: 16}}
              checked={rememberMe}
              onPress={() => setRememberMe(!rememberMe)}
            />
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
          <Vbutton
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
    </View>
  );
};

export default Login;
