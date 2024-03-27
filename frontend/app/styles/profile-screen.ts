import {StyleSheet} from 'react-native';
import {darkModeBgColor, lightModeBgColor} from '../enums/color';

export const profileScreen = (isDarkMode?: boolean) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? darkModeBgColor : lightModeBgColor,
      alignItems: 'center',
    },
  });
