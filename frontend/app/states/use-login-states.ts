import {useEffect, useState} from 'react';
import {LoginService} from '../services/login.service';
import {LoadingProviderService} from '../services/context-providers.service';
import {LocalStorageService} from '../services/local-storage.service';

export const useLoginState = () => {
  const [username, setUsername] = useState(
    LocalStorageService.getDataString(['username']).username || '',
  );
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const {setLoadingState} = LoadingProviderService.useLoading();

  useEffect(() => {
    setLoadingState(true);
    const {username: loadedUsername, rememberMe: loadedRememberme} =
      LoginService.loadUsernameAndRememberMe();
    setUsername(loadedUsername || '');
    setRememberMe(loadedRememberme || false);
    setLoadingState(false);
  }, []);

  return {
    username,
    setUsername,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
  };
};
