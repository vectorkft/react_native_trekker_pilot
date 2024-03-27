import {StyleSheet} from 'react-native';
import {darkModeBgColor, lightModeBgColor} from '../enums/color';

export const loadingStyles = (isDarkMode?: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? darkModeBgColor : lightModeBgColor,
    },
  });
