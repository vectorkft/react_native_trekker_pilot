import React, {JSX, useContext, useEffect, useRef, useState} from 'react';
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
import {UserLoginDTOInput} from '../../../shared/dto/user-login';
import VInput from '../components/Vinput';
import {useNetInfo} from '../states/use-net-info';
import {DarkModeContext} from '../providers/dark-mode';
import {LoadingContext} from '../providers/loading';
import {deviceData} from '../constants/device-data';
import {AlertType} from '../enums/type';
import {loginScreenStyles} from '../styles/login-screen';
import {Color} from '../enums/color';
import {ErrorContext} from '../providers/error';
import {ApiResponseOutput} from '../types/api-response';
import {RouteProp, useRoute} from '@react-navigation/native';
import {UIConfig} from '../types/u-i-config';
import withLoader from '../components/with-loader';
import withNetInfo from '../components/with-net-info';

const Login = ({navigation}: AppNavigation): JSX.Element => {
  const BUTTON_FONT_SIZE = 20;
  const BUTTON_HEIGHT = 50;
  const BUTTON_BORDER_RADIUS = 10;
  const {isDarkMode, toggleDarkMode} = useContext(DarkModeContext);
  const {setError} = useContext(ErrorContext);
  const {setLoadingState} = useContext(LoadingContext);
  const usernameInput = useRef<TextInput | null>(null);
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
  const routeFocus = useRoute<RouteProp<UIConfig, 'login'>>();
  const focus = routeFocus?.params?.focus;
  const {height} = Dimensions.get('window');
  const netInfo = useNetInfo();

  useEffect(() => {
    if (focus) {
      setTimeout(() => {
        if (!username) {
          usernameInput.current?.focus();
        } else if (username) {
          passwordInput.current?.focus();
        }
      }, 100);
    }
  }, [focus]);

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
    setAccessToken(loginSuccess?.data?.accessToken);
    setRefreshToken(loginSuccess?.data?.refreshToken);
    setDeviceType(loginSuccess?.data?.deviceType);
    setIsLoggedIn(true);
    navigation.setParams({focus: false});
    navigation.navigate('homeScreen', {hideButton: true});
    setLoadingState(false);
  };

  const handleFormSubmit = async () => {
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

  return (
    <View style={loginScreenStyles(isDarkMode).container}>
      <Image
        source={require('../../assets/img/header.png')}
        style={loginScreenStyles(false, height).image}
      />
      {errorMessage && (
        <VAlert
          type={AlertType.error}
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
              ref: usernameInput,
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
                    color={isDarkMode ? Color.lightContent : Color.darkContent}
                  />
                </>
              ),
            }}
          />
          <View style={loginScreenStyles().checkBoxView}>
            <CheckBox
              title="Emlékezz rám"
              checkedColor={Color.primary}
              uncheckedColor={
                isDarkMode ? Color.lightContent : Color.darkContent
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
                thumbColor={isDarkMode ? Color.primary : '#616161'}
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
                color: isDarkMode ? Color.lightContent : Color.darkContent,
              },
              buttonStyle: {
                backgroundColor: Color.primary,
                height: BUTTON_HEIGHT,
                borderRadius: BUTTON_BORDER_RADIUS,
              },
              onPress: handleFormSubmit,
              disabled: !username || !password || !netInfo.isConnected,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default withLoader(withNetInfo(Login));
