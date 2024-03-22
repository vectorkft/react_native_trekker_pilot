import {StyleSheet} from 'react-native';
import {colors} from '../enums/colors';

const MARGIN = 20;
const MARGIN_TOP = 15;
const BORDER_RADIUS = 20;
const PADDING = 35;

export const alertStylesheet = StyleSheet.create({
  modalView: {
    margin: MARGIN,
    borderRadius: BORDER_RADIUS,
    padding: PADDING,
    alignItems: 'center',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  alertTitle: {
    fontWeight: 'bold',
    color: colors.lightContent,
  },
  alertMessage: {
    marginTop: MARGIN_TOP,
    color: colors.lightContent,
    textAlign: 'center',
  },
});
