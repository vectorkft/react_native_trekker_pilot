import {create} from 'zustand';
interface Store {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  accessToken: string;
  setAccessToken: (value: string) => void;
  refreshToken: string;
  setRefreshToken: (value: string) => void;
  id: number;
  setId: (value: number) => void;
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;
  uptoDate: boolean;
  setUptoDate: (value: boolean) => void;
  wasDisconnected: boolean;
  setWasDisconnected: (value: boolean) => void;
}

export const useStore = create<Store>(set => ({
  isLoggedIn: false,
  setIsLoggedIn: value => set({isLoggedIn: value}),
  accessToken: '',
  setAccessToken: value => set({accessToken: value}),
  refreshToken: '',
  setRefreshToken: value => set({refreshToken: value}),
  id: 0,
  setId: value => set({id: value}),
  isConnected: false,
  setIsConnected: value => set({isConnected: value}),
  uptoDate: false,
  setUptoDate: value => set({uptoDate: value}),
  wasDisconnected: false,
  setWasDisconnected: value => set({wasDisconnected: value}),
}));
