import {StyleSheet} from 'react-native';
import {Color, darkModeBgColor, lightModeBgColor} from '../enums/color';

const FONT_SIZE = 16;
const FONT_SIZE_TITLE = 30;
const MARGIN_LEFT = -8;
const SCREEN_HEIGHT = 600;
const IMAGE_HEIGHT = 200;
const IMAGE_HEIGHT_LOWER = 100;

export const loginScreenStyles = (isDarkMode?: boolean, height?: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? darkModeBgColor : lightModeBgColor,
    },
    image: {
      width: '100%',
      height:
        typeof height !== 'undefined' && height > SCREEN_HEIGHT
          ? IMAGE_HEIGHT
          : IMAGE_HEIGHT_LOWER,
    },
    innerView: {
      flex: 1,
      alignItems: 'center',
    },
    titleStyle: {
      fontFamily: 'Roboto',
      fontSize: FONT_SIZE_TITLE,
      fontWeight: 'bold',
      color: isDarkMode ? Color.lightContent : Color.darkContent,
    },
    inputView: {
      width: '90%',
    },
    checkBoxView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkBoxContainerStyle: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      alignSelf: 'flex-start',
      marginLeft: MARGIN_LEFT,
    },
    checkBoxTextStyle: {
      color: isDarkMode ? Color.lightContent : Color.darkContent,
      fontSize: FONT_SIZE,
    },
    switchMode: {
      position: 'absolute',
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
    },
    switchModeText: {
      fontSize: FONT_SIZE,
      fontWeight: 'bold',
      color: isDarkMode ? Color.lightContent : Color.darkContent,
    },
  });
