import {create} from 'zustand';

interface Store {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    accessToken: string | null;
    setAccessToken: (value: string | null) => void;
    refreshToken: string | null;
    setRefreshToken: (value: string | null) => void;
    id: number | null;
    setId: (value: number | null) => void;
}

export const useStore = create<Store>(set => ({
    isLoggedIn: false,
    setIsLoggedIn: (value) => set({ isLoggedIn: value }),
    accessToken: null,
    setAccessToken: (value) => set({ accessToken: value }),
    refreshToken: null,
    setRefreshToken: (value) => set({ refreshToken: value }),
    id: null,
    setId: (value) => set({ id: value }),
}));