import {useEffect, useState} from 'react';
import {LoginService} from '../services/login.service';
import {LocalStorageService} from '../services/local-storage.service';
import DeviceInfo from 'react-native-device-info';

export const useLoginState = () => {
  const [username, setUsername] = useState(
    LocalStorageService.getDataString(['username']).username || '',
  );
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const {username: loadedUsername, rememberMe: loadedRememberme} =
      LoginService.loadUsernameAndRememberMe();
    console.log(DeviceInfo.isKeyboardConnectedSync());
    DeviceInfo.isKeyboardConnected().then(value => {
      console.log(value);
    });
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
