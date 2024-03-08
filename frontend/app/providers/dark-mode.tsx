import React, {createContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useColorScheme} from 'react-native';
import {DarkMode} from '../interfaces/dark-mode';

export const DarkModeContext = createContext<DarkMode | undefined>(undefined);

export const DarkModeProvider = ({children}: {children: ReactNode}) => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem('darkMode')
      .then(savedMode => {
        if (!cancelled && savedMode !== null && colorScheme !== 'dark') {
          setIsDarkMode(JSON.parse(savedMode));
        }
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [colorScheme, setIsDarkMode]);


  const value = {isDarkMode, toggleDarkMode};

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};
