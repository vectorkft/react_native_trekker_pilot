import React, {createContext, useState, useEffect, ReactNode} from 'react';
import {MMKV} from 'react-native-mmkv';
import {useColorScheme} from 'react-native';
import {DarkMode} from '../interfaces/dark-mode';

export const DarkModeContext = createContext<DarkMode | undefined>(undefined);

export const DarkModeProvider = ({children}: {children: ReactNode}) => {
  const colorScheme = useColorScheme();

  const storage = new MMKV({
    id: 'app',
  });

  const storedDarkMode = storage.getString('darkMode');
  const [isDarkMode, setIsDarkMode] =
      useState(storedDarkMode ? JSON.parse(storedDarkMode) : colorScheme === 'dark');

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    storage.set('darkMode', JSON.stringify(newMode));
  };

  useEffect(() => {
    const savedMode = storage.getString('darkMode');
    if (savedMode !== null && colorScheme !== 'dark') {
      if (typeof savedMode === "string") {
        setIsDarkMode(JSON.parse(savedMode));
      }
    }
  }, [colorScheme, setIsDarkMode]);

  const value = {isDarkMode, toggleDarkMode};

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};
