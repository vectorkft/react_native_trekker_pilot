import {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {networkChange} from '../services/net-info';

export const useNetInfo = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [mountConnection, setMountConnection] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setMountConnection(state.isConnected ?? false);
      setIsConnected(state.isConnected ?? false);
      networkChange(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {mountConnection, isConnected};
};
