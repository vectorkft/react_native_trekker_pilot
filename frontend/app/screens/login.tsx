import React, {JSX, useContext, useRef, useState} from 'react';
import {LoginService} from '../services/login';
import {AppNavigation} from '../interfaces/navigation';
import {useStore} from '../states/zustand';
import {
  parseZodError,
  validateZDTOForm,
} from '../../../shared/services/zod-dto.service';
import {ZodError} from 'zod';
import {Dimensions, Image, TextInput, View} from 'react-native';
import {useLoginState} from '../states/use-login';
import VAlert from '../components/Valert';
import {useAlert} from '../states/use-alert';
import {CheckBox, Icon, Switch, Text} from 'react-native-elements';
import VButton from '../components/Vbutton';
import LoadingScreen from './loading-screen';
import {UserLoginDTOInput} from '../../../shared/dto/user-login.dto';
import VInput from '../components/Vinput';
import {useNetInfo} from '../states/use-net-info';
import {LocalStorageService} from '../services/local-storage';
import * as Sentry from '@sentry/react-native';
import {DarkModeContext} from '../providers/dark-mode';
import {LoadingContext} from '../providers/loading';
import {deviceData} from '../constants/device-data';
import {AlertTypes} from '../enums/types';
import {loginScreenStyles} from '../styles/login-screen';
import {colors} from '../enums/colors';

const Login = ({navigation}: AppNavigation): JSX.Element => {
  const BUTTON_FONT_SIZE = 20;
  const BUTTON_HEIGHT = 50;
  const BUTTON_BORDER_RADIUS = 10;
  const {isDarkMode, toggleDarkMode} = useContext(DarkModeContext);
  const {loading, setLoadingState} = useContext(LoadingContext);
  const passwordInput = useRef<TextInput | null>(null);
  const {
    setRefreshToken,
    setAccessToken,
    setIsLoggedIn,
    isLoggedIn,
    setDeviceType,
  } = useStore.getState();
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
  const {height} = Dimensions.get('window');
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
        deviceData: deviceData,
      })) as {isValid: boolean; error: ZodError};

      if (!isValid) {
        const msg = await parseZodError(error);
        return setErrorMessage(msg);
      }

      const loginSuccess = await LoginService.handleSubmit({
        name: username,
        pw: password,
        deviceData: deviceData,
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
      setAccessToken(
        'accessToken' in loginSuccess ? loginSuccess.accessToken : '',
      );
      setRefreshToken(
        'refreshToken' in loginSuccess ? loginSuccess.refreshToken : '',
      );
      setDeviceType(
        'deviceType' in loginSuccess ? loginSuccess.deviceType : '',
      );
      setIsLoggedIn(true);
      setErrorMessage(null);
      return navigation.navigate('homescreen', {hidebutton: true});
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
    <View style={loginScreenStyles(isDarkMode).container}>
      <Image
        source={require('../../assets/img/header.png')}
        style={loginScreenStyles(false, height).image}
      />
      {errorMessage && (
        <VAlert
          type={AlertTypes.error}
          title={'Hibás belépés!'}
          message={errorMessage}
        />
      )}
      <View style={loginScreenStyles().innerView}>
        <Text style={loginScreenStyles(isDarkMode).titleStyle}>
          Bejelentkezés
        </Text>
        <View style={loginScreenStyles().inputView}>
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
                    color={
                      isDarkMode ? colors.lightContent : colors.darkContent
                    }
                  />
                </>
              ),
            }}
          />
          <View style={loginScreenStyles().checkBoxView}>
            <CheckBox
              title="Emlékezz rám"
              checkedColor="#00EDAE"
              uncheckedColor={
                isDarkMode ? colors.lightContent : colors.darkContent
              }
              containerStyle={loginScreenStyles().checkBoxContainerStyle}
              textStyle={loginScreenStyles(isDarkMode).checkBoxTextStyle}
              checked={rememberMe}
              onPress={() => setRememberMe(!rememberMe)}
            />
            <View style={loginScreenStyles().switchMode}>
              <Text style={loginScreenStyles(isDarkMode).switchModeText}>
                Sötét mód
              </Text>
              <Switch
                trackColor={{
                  false: isDarkMode ? '#424242' : '#E0E0E0',
                  true: '#fff',
                }}
                thumbColor={isDarkMode ? colors.primary : '#616161'}
                onValueChange={toggleDarkMode}
                value={isDarkMode}
              />
            </View>
          </View>
          <VButton
            buttonPropsNativeElement={{
              title: 'Bejelentkezés',
              titleStyle: {
                fontFamily: 'Roboto',
                fontSize: BUTTON_FONT_SIZE,
                fontWeight: '700',
                color: isDarkMode ? '#fff' : '#000',
              },
              buttonStyle: {
                backgroundColor: '#00EDAE',
                height: BUTTON_HEIGHT,
                borderRadius: BUTTON_BORDER_RADIUS,
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
