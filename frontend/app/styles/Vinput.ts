import {StyleSheet} from 'react-native';
import {colors} from '../enums/colors';

const SHADOW_OFFSET_HEIGHT = 2;
const SHADOW_OPACITY = 0.25;
const SHADOW_RADIUS = 3.84;
const ELEVATION = 5;
const MARGIN_TOP = 10;
const BORDER_RADIUS = 10;
const CONTAINER_HEIGHT = 50;

export const inputStylesheet = (isDarkMode?: boolean) =>
  StyleSheet.create({
    containerStyle: {
      marginTop: MARGIN_TOP,
      borderRadius: BORDER_RADIUS,
      height: CONTAINER_HEIGHT,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: SHADOW_OFFSET_HEIGHT,
      },
      shadowOpacity: SHADOW_OPACITY,
      shadowRadius: SHADOW_RADIUS,
      elevation: ELEVATION,
      backgroundColor: isDarkMode
        ? colors.bgColorComponentsDark
        : colors.bgColorComponentsLight,
    },
    inputContainerStyle: {
      borderBottomWidth: 0,
    },
    inputStyle: {
      color: isDarkMode ? colors.lightContent : colors.darkContent,
      textAlignVertical: 'center',
    },
  });
