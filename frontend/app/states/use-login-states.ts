import {useEffect, useState} from 'react';
import {LoginService} from '../services/login.service';
import {LoadingService} from '../services/loading.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

export const useFocus = (storedUsername: string | null) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (storedUsername !== null || true) {
      setIsFocused(true);
    }
  }, [storedUsername]);

  return {isFocused,setIsFocused};
};
