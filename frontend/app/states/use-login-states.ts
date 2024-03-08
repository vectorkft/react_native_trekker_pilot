import {useEffect, useState} from 'react';
import {LoginService} from '../services/login.service';
import {LoadingService} from '../services/loading.service';

export const useLoginState = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const {setLoadingState} = LoadingService.useLoading();

  useEffect(() => {
    setLoadingState(true);
    const { username, rememberMe } = LoginService.loadUsernameAndRememberMe();
    setUsername(username);
    setRememberMe(rememberMe);
    setLoadingState(false);
  }, []);

  return {
    username,
    setUsername,
    password,
    setPassword,
    rememberMe,
    setRememberMe
  };
};
