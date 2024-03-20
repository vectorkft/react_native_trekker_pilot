import {StyleSheet} from 'react-native';
import {colors} from '../enums/colors';

const PADDING_VERTICAL = 10;
const PADDING_HORIZONTAL = 20;
const TOP = 15;
const BORDER_RADIUS = 10;
const SHADOW_OFFSET_HEIGHT = 6;
const SHADOW_OPACITY = 0.5;
const SHADOW_RADIUS = 6;
const SHADOW_ELEVATION = 6;

export const toastStylesheet = (isDarkMode?: boolean) =>
  StyleSheet.create({
    toast: {
      zIndex: 1,
      position: 'absolute',
      width: '90%',
      paddingVertical: PADDING_VERTICAL,
      paddingHorizontal: PADDING_HORIZONTAL,
      top: TOP,
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
  });
