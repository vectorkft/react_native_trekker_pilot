import {StyleSheet} from 'react-native';
import {darkModeBgColor, lightModeBgColor} from '../enums/color';

const ICON_MARGIN_LEFT = 10;
const HAMBURGER_MENU_TOP_MARGIN = -45;

export const productStyles = (isDarkMode?: boolean) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? darkModeBgColor : lightModeBgColor,
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    innerView: {
      marginLeft: '12%',
      width: '70%',
    },
    iconView: {
      flexDirection: 'row',
    },
    iconDisabledStyle: {
      backgroundColor: 'transparent',
    },
    iconContainerStyle: {
      marginLeft: ICON_MARGIN_LEFT,
    },
    hamburgerMenuView: {
      marginLeft: '80%',
      marginTop: HAMBURGER_MENU_TOP_MARGIN,
    },
  });
