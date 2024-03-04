import React, {createContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useColorScheme} from 'react-native';
import {DarkMode} from '../interfaces/dark-mode';
import {ActivityIndicator, View} from 'react-native';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';

export const DarkModeContext = createContext<DarkMode | undefined>(undefined);

export const DarkModeProvider = ({children}: {children: ReactNode}) => {
  const colorScheme = useColorScheme();
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
        if (!cancelled && savedMode !== null && colorScheme !== 'dark') {
          setIsDarkMode(JSON.parse(savedMode));
        }
        setLoading(false);
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [colorScheme, setIsDarkMode]);

  if (loading) {
    return (
      <View style={isDarkMode ? darkModeContent.darkContainer : darkModeContent.lightContainer}>
        <ActivityIndicator
          size="large"
          color={isDarkMode ? '#ffffff' : '#000000'}
        />
      </View>
    );
  }

  const value = {isDarkMode, toggleDarkMode};

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};
