import React, {createContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native-appearance';

interface DarkModeContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => Promise<void>;
}

// Létrehozunk egy új kontextust a sötét mód állapotának tárolására
export const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

// A DarkModeProvider komponens biztosítja a kontextust a gyermekkomponensek számára
export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
    const colorScheme = Appearance.getColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

    const toggleDarkMode = async () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        await AsyncStorage.setItem('darkMode', JSON.stringify(newMode));
    };

    useEffect(() => {
        const loadDarkMode = async () => {
            const savedMode = await AsyncStorage.getItem('darkMode');
            if (savedMode !== null) {
                setIsDarkMode(JSON.parse(savedMode));
            }
        };
        loadDarkMode();
    }, []);

    useEffect(() => {
        const subscription = Appearance.addChangeListener(async ({ colorScheme }) => {
            if (colorScheme === 'dark') {
                setIsDarkMode(true);
                await AsyncStorage.setItem('darkMode', JSON.stringify(colorScheme === 'dark'));
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    // A kontextus értékét beállítjuk, hogy tartalmazza az isDarkMode állapotot és a toggleDarkMode függvényt
    const value = { isDarkMode, toggleDarkMode };

    return (
        // A DarkModeProvider komponens által biztosított érték elérhető lesz minden gyermekkomponens számára
        <DarkModeContext.Provider value={value}>
            {children}
        </DarkModeContext.Provider>
    );
};
