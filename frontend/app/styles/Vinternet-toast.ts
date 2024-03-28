import {StyleSheet} from 'react-native';
import {Color} from '../enums/color';

const PADDING_VERTICAL = 10;
const PADDING_HORIZONTAL = 10;
const BOTTOM = 15;
const BORDER_RADIUS = 10;
const SHADOW_ELEVATION = 3;
const MARGIN_LEFT = 15;
const FONT_SIZE = 15;

export const internetToastStylesheet = (isDarkMode?: boolean) =>
  StyleSheet.create({
    toast: {
      zIndex: 1,
      position: 'absolute',
      width: '90%',
      paddingVertical: PADDING_VERTICAL,
      paddingHorizontal: PADDING_HORIZONTAL,
      bottom: BOTTOM,
      borderRadius: BORDER_RADIUS,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'space-between',
      elevation: SHADOW_ELEVATION,
      backgroundColor: isDarkMode
        ? Color.bgColorComponentsDark
        : Color.placeholderLight,
    },
    textStyle: {
      color: isDarkMode ? Color.lightContent : Color.darkContent,
      fontSize: FONT_SIZE,
      marginLeft: MARGIN_LEFT,
      fontWeight: 'bold',
    },
    activityIndicatorStyle: {
      marginLeft: MARGIN_LEFT,
    },
  });
