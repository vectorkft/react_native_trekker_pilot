import {StyleSheet} from 'react-native';
import {darkModeBgColor, lightModeBgColor} from '../enums/colors';

export const loginScreenStyles = (isDarkMode?: boolean, height?: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? darkModeBgColor : lightModeBgColor,
    },
    image: {
      width: '100%',
      height: typeof height !== 'undefined' && height > 600 ? 200 : 100,
    },
  });
