import {StyleSheet} from 'react-native';

const ICON_MARGIN_LEFT = 10;
const HAMBURGER_MENU_TOP_MARGIN = -45;

export const productStyles = StyleSheet.create({
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
