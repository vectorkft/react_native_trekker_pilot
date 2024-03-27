import {StyleSheet} from 'react-native';
import {Color} from '../enums/color';

const TILE_WIDTH = 120;
const TILE_HEIGHT = 110;
const BORDER_RADIUS = 10;
const BORDER_WIDTH = 2;
const FONT_SIZE = 20;

export const tileStylesheet = (isDarkMode?: boolean) =>
  StyleSheet.create({
    tile: {
      width: TILE_WIDTH,
      height: TILE_HEIGHT,
      borderRadius: BORDER_RADIUS,
      borderWidth: BORDER_WIDTH,
      borderColor: '#00EDAE',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#2d2d2d' : '#d2cfcf',
    },
    title: {
      color: isDarkMode ? Color.lightContent : Color.darkContent,
      fontSize: FONT_SIZE,
      fontWeight: 'bold',
    },
  });
