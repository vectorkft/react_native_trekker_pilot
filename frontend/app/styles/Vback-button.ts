import {StyleSheet} from 'react-native';

const HEADER_POSITION_LEFT = 5;
const HEADER_POSITION_TOP = 15;

export const vbackButton = (styleButton: boolean | undefined) =>
  StyleSheet.create({
    positionHeader: {
      position: 'absolute',
      left: HEADER_POSITION_LEFT,
      top: styleButton ? HEADER_POSITION_TOP : undefined,
    },
  });
