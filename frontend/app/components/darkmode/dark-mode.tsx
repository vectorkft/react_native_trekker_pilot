import React, {createContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native-appearance';
import {DarkMode} from "../../interfaces/dark-mode";
import {ActivityIndicator, View} from "react-native";
export const DarkModeContext = createContext<DarkMode | undefined>(undefined);

// A DarkModeProvider komponens biztosítja a kontextust a gyermekkomponensek számára
export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
    const colorScheme = Appearance.getColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
    const [loading, setLoading] = useState(true);

    const toggleDarkMode = async () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        await AsyncStorage.setItem('darkMode', JSON.stringify(newMode));
    };

    useEffect(() => {
        let cancelled = false;

        AsyncStorage.getItem('darkMode')
            .then(savedMode => {
                if(savedMode !== null){
                    setIsDarkMode(JSON.parse(savedMode));
                }
                setLoading(false);
            })
            .catch(console.error);

        return () => {
            cancelled = true;
        };
    }, [setIsDarkMode]);

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

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    // A kontextus értékét beállítjuk, hogy tartalmazza az isDarkMode állapotot és a toggleDarkMode függvényt
    const value = { isDarkMode, toggleDarkMode };

    return (
        // A DarkModeProvider komponens által biztosított érték elérhető lesz minden gyermekkomponens számára
        <DarkModeContext.Provider value={value}>
            {children}
        </DarkModeContext.Provider>
    );
};
