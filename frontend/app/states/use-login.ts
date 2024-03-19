import {useEffect, useState} from 'react';
import {LoginService} from '../services/login';
import {LocalStorageService} from '../services/local-storage';

export const useLoginState = () => {
  const [username, setUsername] = useState(
    LocalStorageService.getDataString(['username']).username || '',
  );
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const {username: loadedUsername, rememberMe: loadedRememberme} =
      LoginService.loadUsernameAndRememberMe();
    setUsername(loadedUsername || '');
    setRememberMe(loadedRememberme || false);
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
