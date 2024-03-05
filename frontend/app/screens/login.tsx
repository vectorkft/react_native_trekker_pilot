import React, {JSX, useRef} from 'react';
import {LoginService} from '../services/login.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouterProps} from '../interfaces/navigation-props';
import {useStore} from '../states/zustand-states';
import {parseZodError} from '../../../shared/services/zod-dto.service';
import {DarkModeService} from '../services/dark-mode.service';
import {ZodError} from 'zod';
import {LoadingService} from '../services/loading.service';
import {Switch, TextInput} from 'react-native';
import {
  useFocus,
  useLoginState,
  useStoredUsername,
} from '../states/use-login-states';
import VLoading from '../components/VLoading';
import VAlert from '../components/VAlert';
import {useAlert} from '../states/use-alert';
import {
  Box,
  VStack,
  FormControl,
  Input,
  Button,
  Text,
  Heading,
  Checkbox,
} from 'native-base';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {View} from 'react-native';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';

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
  const {isFocused, setIsFocused} = useFocus(storedUsername);
  const passwordInput = useRef<TextInput | null>(null);
  const {loading, setLoadingState} = LoadingService.useLoading();
  const {setId, setRefreshToken, setAccessToken, setIsLoggedIn} =
    useStore.getState();
  const {isDarkMode, toggleDarkMode} = DarkModeService.useDarkMode();
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
    return <VLoading isDarkModeOn={isDarkMode} />;
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
      <Box
        flex={1}
        bg={isDarkMode ? Colors.darker : Colors.lighter}
        alignItems="center"
        justifyContent="center">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading
            size="2xl"
            fontWeight="bold"
            color={isDarkMode ? Colors.white : Colors.black}>
            Bejelentkezés
          </Heading>
          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>
                <Text
                  fontSize={'xl'}
                  fontWeight={'bold'}
                  color={isDarkMode ? Colors.white : Colors.black}>
                  Felhasználónév*
                </Text>
              </FormControl.Label>
              <Input
                value={username}
                onChangeText={setUsername}
                autoFocus={isFocused && !storedUsername}
                placeholder="Add meg a felhasználónevedet"
                onSubmitEditing={() => passwordInput.current?.focus()}
                blurOnSubmit={false}
                color={isDarkMode ? Colors.white : Colors.black}
                placeholderTextColor={isDarkMode ? Colors.white : Colors.black}
                borderColor={isDarkMode ? Colors.white : Colors.black}
                _focus={{borderColor: '#00EDAE'}}
                style={{fontSize: 15}}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>
                <Text
                  fontSize={'xl'}
                  fontWeight={'bold'}
                  color={isDarkMode ? Colors.white : Colors.black}>
                  Jelszó*
                </Text>
              </FormControl.Label>
              <Input
                ref={passwordInput}
                type="password"
                value={password}
                onChangeText={setPassword}
                autoFocus={isFocused && !!storedUsername}
                placeholder="Add meg a jelszavadat"
                placeholderTextColor={isDarkMode ? Colors.white : Colors.black}
                color={isDarkMode ? Colors.white : Colors.black}
                onSubmitEditing={handleFormSubmit}
                borderColor={isDarkMode ? Colors.white : Colors.black}
                _focus={{borderColor: '#00EDAE'}}
                style={{fontSize: 15}}
              />
            </FormControl>
            <Checkbox
              value="rememberMe"
              isChecked={rememberMe}
              onChange={isChecked => setRememberMe(isChecked)}
              colorScheme={rememberMe ? 'green' : 'gray'}>
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={isDarkMode ? Colors.white : Colors.black}>
                Emlékezz rám
              </Text>
            </Checkbox>
            <Button
              mt="2"
              bg={'#00EDAE'}
              onPress={handleFormSubmit}
              isDisabled={!username || !password}>
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={isDarkMode ? Colors.white : Colors.black}>
                Bejelentkezés
              </Text>
            </Button>
          </VStack>
        </Box>
      </Box>
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
