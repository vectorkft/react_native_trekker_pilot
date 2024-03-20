import {StyleSheet} from 'react-native';
import {colors} from '../enums/colors';

const PADDING_VERTICAL = 10;
const PADDING_HORIZONTAL = 10;
const BOTTOM = 15;
const BORDER_RADIUS = 10;
const SHADOW_OFFSET_HEIGHT = 4;
const SHADOW_OPACITY = 0.3;
const SHADOW_RADIUS = 4;
const SHADOW_ELEVATION = 4;
const MARGIN_LEFT = 15;
const FONT_SIZE = 15;

export const internetToastStylesheet = (isDarkMode?: boolean) =>
  StyleSheet.create({
    toast: {
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
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: SHADOW_OFFSET_HEIGHT,
      },
      shadowOpacity: SHADOW_OPACITY,
      shadowRadius: SHADOW_RADIUS,
      elevation: SHADOW_ELEVATION,
      backgroundColor: isDarkMode
        ? colors.bgColorComponentsDark
        : colors.placeholderLight,
    },
    textStyle: {
      color: isDarkMode ? colors.lightContent : colors.darkContent,
      fontSize: FONT_SIZE,
      marginLeft: MARGIN_LEFT,
      fontWeight: 'bold',
    },
    activityIndicatorStyle: {
      marginLeft: MARGIN_LEFT,
    },
  });
