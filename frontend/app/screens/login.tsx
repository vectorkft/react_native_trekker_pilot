import React, {JSX, useRef} from 'react';
import {LoginService} from '../services/login.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouterProps} from '../interfaces/navigation-props';
import {useStore} from '../states/zustand-states';
import {parseZodError} from '../../../shared/services/zod-dto.service';
import {DarkModeService} from '../services/dark-mode.service';
import {ZodError} from 'zod';
import {LoadingService} from '../services/loading.service';
import {TextInput, View} from 'react-native';
import {
  useFocus,
  useLoginState,
  useNavigationFocus,
  useStoredUsername,
} from '../states/use-login-states';
import VAlert from '../components/VAlert';
import {useAlert} from '../states/use-alert';
import {CheckBox, Input, Text, Switch} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import VButton from '../components/VButton';
import LoadingScreen from './loading-screen';
const Login = ({navigation}: RouterProps): JSX.Element => {
  const {isDarkMode, toggleDarkMode} = DarkModeService.useDarkMode();
  const {loading, setLoadingState} = LoadingService.useLoading();
  const passwordInput = useRef<TextInput | null>(null);
  const {storedUsername} = useStoredUsername();
  const {isFocused, setIsFocused} = useFocus(storedUsername);
  const {setId, setRefreshToken, setAccessToken, setIsLoggedIn} =
    useStore.getState();
  const [navState] = useNavigationFocus(navigation, setIsFocused);
  const {
    username,
    setUsername,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
  } = useLoginState(navState);
  const {errorMessage, setErrorMessage} = useAlert();

  const handleFormSubmit = async () => {
    try {
      setLoadingState(true);
      const {isValid, error} = (await LoginService.validateForm({
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
      setErrorMessage(null);
      setIsFocused(false);
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
        <View style={{marginTop: '5%', width: '90%'}}>
          <Input
            value={username}
            onChangeText={setUsername}
            autoFocus={isFocused && !storedUsername}
            placeholder="Felhasználónév"
            onSubmitEditing={() => passwordInput.current?.focus()}
            blurOnSubmit={false}
            placeholderTextColor={isDarkMode ? '#5b5959' : '#a9a4a4'}
            containerStyle={{
              borderRadius: 10,
              backgroundColor: isDarkMode ? '#343333' : '#dcdcdc',
              height: 50,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            inputContainerStyle={{borderBottomWidth: 0}}
            selectionColor={isDarkMode ? '#fff' : '#000'}
            inputStyle={{
              color: isDarkMode ? '#fff' : '#000',
              textAlignVertical: 'center',
            }}
          />
          <Input
            ref={passwordInput}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            autoFocus={isFocused && !!storedUsername}
            placeholder="Jelszó"
            placeholderTextColor={isDarkMode ? '#5b5959' : '#a9a4a4'}
            containerStyle={{
              marginTop: 10,
              borderRadius: 10,
              backgroundColor: isDarkMode ? '#343333' : '#dcdcdc',
              height: 50,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            inputContainerStyle={{borderBottomWidth: 0}}
            selectionColor={isDarkMode ? '#fff' : '#000'}
            inputStyle={{
              color: isDarkMode ? '#fff' : '#000',
              textAlignVertical: 'center',
            }}
            onSubmitEditing={handleFormSubmit}
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
