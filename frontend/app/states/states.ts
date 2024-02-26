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
    results: boolean;
    setResults: (value: boolean) => void;
    flag: boolean;
    setFlag: (value: boolean) => void;
}

export const useStore = create<Store>(set => ({
    isLoggedIn: false,
    setIsLoggedIn: (value) => set({ isLoggedIn: value }),
    accessToken: '',
    setAccessToken: (value) => set({ accessToken: value }),
    refreshToken: '',
    setRefreshToken: (value) => set({ refreshToken: value }),
    id: 0,
    setId: (value) => set({ id: value }),
    results: false,
    setResults: (value) => set({ results: value }),
    flag: true,
    setFlag: (value) => set({ flag: value }),
}));