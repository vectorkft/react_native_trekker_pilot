import {StyleSheet} from 'react-native';
import {darkModeBgColor, lightModeBgColor} from '../enums/colors';

export const profileScreen = (isDarkMode?: boolean) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? darkModeBgColor : lightModeBgColor,
      alignItems: 'center',
    },
  });
