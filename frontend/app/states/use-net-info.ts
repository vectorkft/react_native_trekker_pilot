import {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {networkChange} from '../services/net-info.service';
import {useStore} from './zustand-states';

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
      } else if (wasDisconnected && isConnected) {
        setWasDisconnected(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected, setWasDisconnected, wasDisconnected]);

  return {mountConnection};
};
