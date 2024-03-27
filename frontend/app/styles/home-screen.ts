import {StyleSheet} from 'react-native';
import {darkModeBgColor, lightModeBgColor} from '../enums/color';

export const homeScreenStyles = (isDarkMode?: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: isDarkMode ? darkModeBgColor : lightModeBgColor,
    },
    innerView: {
      flex: 1,
      justifyContent: 'center',
    },
  });
