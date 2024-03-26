import {StyleSheet} from 'react-native';
import {colors, darkModeBgColor, lightModeBgColor} from '../enums/colors';

const BORDER_RADIUS = 10;
const PADDING = 20;
const ELEVATION = 5;
const FONT_SIZE_TITLE = 24;
const MARGIN_BOTTOM = 20;
const FONT_SIZE_LABEL = 18;

export const errorScreen = (isDarkMode?: boolean) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? darkModeBgColor : lightModeBgColor,
    },
    modalView: {
      backgroundColor: isDarkMode
        ? colors.bgColorComponentsDark
        : colors.bgColorComponentsLight,
      borderRadius: BORDER_RADIUS,
      padding: PADDING,
      alignItems: 'center',
      elevation: ELEVATION,
    },
    title: {
      color: isDarkMode ? colors.lightContent : colors.darkContent,
      fontSize: FONT_SIZE_TITLE,
      fontWeight: 'bold',
      marginBottom: MARGIN_BOTTOM,
    },
    text: {
      color: isDarkMode ? colors.lightContent : colors.darkContent,
      fontSize: FONT_SIZE_LABEL,
      marginBottom: MARGIN_BOTTOM,
    },
  });
