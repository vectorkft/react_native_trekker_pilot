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
    globalFlagSuccess: boolean;
    setGlobalFlagSuccess: (value: boolean) => void;
    globalFlagHelperFailed: boolean;
    setGlobalFlagHelperFailed: (value: boolean) => void;
    globalFlagHelperNotFound: boolean;
    setGlobalFlagHelperNotFound: (value: boolean) => void;
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
    globalFlagSuccess: false,
    setGlobalFlagSuccess: (value) => set({ globalFlagSuccess: value }),
    globalFlagHelperFailed: false,
    setGlobalFlagHelperFailed: (value) => set({ globalFlagHelperFailed: value }),
    globalFlagHelperNotFound: false,
    setGlobalFlagHelperNotFound: (value) => set({ globalFlagHelperNotFound: value }),
}));