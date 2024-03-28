import {create} from 'zustand';
interface Store {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  accessToken: string;
  setAccessToken: (value: string) => void;
  refreshToken: string;
  setRefreshToken: (value: string) => void;
  deviceType: string;
  setDeviceType: (value: string) => void;
}

export const useStore = create<Store>(set => ({
  isLoggedIn: false,
  setIsLoggedIn: value => set({isLoggedIn: value}),
  accessToken: '',
  setAccessToken: value => set({accessToken: value}),
  refreshToken: '',
  setRefreshToken: value => set({refreshToken: value}),
  deviceType: '',
  setDeviceType: value => set({deviceType: value}),
}));
