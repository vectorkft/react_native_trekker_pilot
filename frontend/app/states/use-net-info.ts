import {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {networkChange} from '../services/net-info';
import {useStore} from './zustand';

export const useNetInfo = () => {
  const [mountConnection, setMountConnection] = useState(false);
  const {wasDisconnected, isConnected, setWasDisconnected} =
    useStore.getState();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setMountConnection(state.isConnected ?? false);
      networkChange(state.isInternetReachable ?? false);
      if (!(state.isInternetReachable ?? false)) {
        setWasDisconnected(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected, setWasDisconnected, wasDisconnected]);

  return {mountConnection};
};
