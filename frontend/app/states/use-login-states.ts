import {useEffect, useRef, useState} from 'react';
import {LoginService} from '../services/login.service';
import {LoadingService} from '../services/loading.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TextInput} from 'react-native';

export const useLoginState = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const {setLoadingState} = LoadingService.useLoading();

  useEffect(() => {
    let cancelled = false;
    setLoadingState(true);
    LoginService.loadUsernameAndRememberMe()
      .then(({username: savedUsername, rememberMe: savedRememberMe}) => {
        if (!cancelled) {
          setUsername(savedUsername);
          setRememberMe(savedRememberMe);
          setLoadingState(false);
        }
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [setUsername, setRememberMe]);

  return {
    username,
    setUsername,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
  };
};

export const useStoredUsername = () => {
  const [storedUsername, setStoredUsername] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('username').then(value => setStoredUsername(value));
  }, []);

  return {storedUsername, setStoredUsername};
};

// Egyedi hook a fókusz kezelésére
export const useFocus = (
  username: string,
  usernameSubmitted: boolean,
  storedUsername: string | null,
) => {
  const usernameInputRef = useRef<TextInput | null>(null);
  const passwordInput = useRef<TextInput | null>(null);

  useEffect(() => {
    if (usernameInputRef.current && username === '') {
      usernameInputRef.current?.focus();
    } else if (
      (username !== '' && usernameSubmitted) ||
      storedUsername !== null
    ) {
      passwordInput.current?.focus();
    }
  });

  return {usernameInputRef, passwordInput};
};
