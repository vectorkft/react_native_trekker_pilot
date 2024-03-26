import React, {JSX, useContext, useRef, useState} from 'react';
import {LoginService} from '../services/login';
import {AppNavigation} from '../interfaces/navigation';
import {useStore} from '../states/zustand';
import {parseZodError, validateZDTOForm} from '../../../shared/services/zod';
import {ZodError} from 'zod';
import {Dimensions, Image, TextInput, View} from 'react-native';
import {useLoginState} from '../states/use-login';
import VAlert from '../components/Valert';
import {useAlert} from '../states/use-alert';
import {CheckBox, Icon, Switch, Text} from 'react-native-elements';
import VButton from '../components/Vbutton';
import LoadingScreen from './loading-screen';
import {
  UserLoginDTOInput,

} from '../../../shared/dto/user-login';
import VInput from '../components/Vinput';
import {useNetInfo} from '../states/use-net-info';
import {DarkModeContext} from '../providers/dark-mode';
import {LoadingContext} from '../providers/loading';
import {deviceData} from '../constants/device-data';
import {AlertTypes} from '../enums/types';
import {loginScreenStyles} from '../styles/login-screen';
import {colors} from '../enums/colors';
import {ErrorContext} from '../providers/error';
import {ApiResponseOutput} from '../interfaces/api-response';

const Login = ({navigation}: AppNavigation): JSX.Element => {
  const BUTTON_FONT_SIZE = 20;
  const BUTTON_HEIGHT = 50;
  const BUTTON_BORDER_RADIUS = 10;
  const {isDarkMode, toggleDarkMode} = useContext(DarkModeContext);
  const {setError} = useContext(ErrorContext);
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

  const handleError = (error: string) => {
    setErrorMessage(error);
    setLoadingState(false);
    return;
  };

  const handleZodError = async (error: ZodError) => {
    const msg = await parseZodError(error);
    setErrorMessage(msg);
    setLoadingState(false);
    return;
  };

  const handleSubmit = (
    loginSuccess: ApiResponseOutput,
    rememberMeValue: boolean,
  ) => {
    if (rememberMeValue) {
      setUsername(username);
    } else {
      setUsername('');
    }
    setPassword('');
    setAccessToken(
      'data' in loginSuccess &&
        loginSuccess.data &&
        'accessToken' in loginSuccess.data &&
        loginSuccess.data.accessToken,
    );
    setRefreshToken(
      'data' in loginSuccess &&
        loginSuccess.data &&
        'refreshToken' in loginSuccess.data &&
        loginSuccess.data.refreshToken,
    );
    setDeviceType(
      'data' in loginSuccess &&
        loginSuccess.data &&
        'deviceType' in loginSuccess.data &&
        loginSuccess.data.deviceType,
    );
    setIsLoggedIn(true);
    setLoadingState(false);
    navigation.navigate('homescreen', {hidebutton: true});
  };

  const handleFormSubmit = async () => {
    if (!mountConnection) {
      setErrorMessage('Ellenőrizd az internetkapcsolatodat!');
      return;
    }

    await validateZDTOForm(
      UserLoginDTOInput,
      {
        name: username,
        pw: password,
        deviceData: deviceData,
      },
      handleZodError,
    );

    setLoadingState(true);
    LoginService.handleSubmit(
      {
        name: username,
        pw: password,
        deviceData: deviceData,
      },
      rememberMe,
      handleError,
      handleSubmit,
      setError,
    ).then(() => {
      setErrorMessage(null);
    });
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
              blurOnSubmit: true,
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
                color: isDarkMode ? colors.lightContent : colors.darkContent,
              },
              buttonStyle: {
                backgroundColor: colors.primary,
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
