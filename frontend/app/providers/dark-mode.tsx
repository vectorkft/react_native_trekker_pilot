import React, {createContext, useState, useEffect, ReactNode} from 'react';
import {useColorScheme} from 'react-native';
import {DarkMode} from '../interfaces/dark-mode';
import {LocalStorageService} from '../services/local-storage.service';

export const DarkModeContext = createContext<DarkMode | undefined>(undefined);

export const DarkModeProvider = ({children}: {children: ReactNode}) => {
  const colorScheme = useColorScheme();

  const storedDarkMode = LocalStorageService.getDataString(['darkMode']);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (storedDarkMode && storedDarkMode.darkMode !== undefined) {
      return JSON.parse(storedDarkMode.darkMode.toString());
    } else {
      return colorScheme === 'dark';
    }
  });

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    LocalStorageService.storeData({darkMode: JSON.stringify(newMode)});
  };

  useEffect(() => {
    if (colorScheme === 'dark') {
      setIsDarkMode(true);
    }
  }, [colorScheme]);

  const value = {isDarkMode, toggleDarkMode};

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};
