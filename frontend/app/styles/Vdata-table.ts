import {StyleSheet} from 'react-native';
import {colors} from '../enums/colors';

const FONT_SIZE = 15;
const MARGIN_TOP = 15;
const MAX_INDEX_FOR_BORDER = 2;
const BORDER_RADIUS = 10;

export const dataTableStylesheet = (
  isDarkMode?: boolean,
  index?: number,
  row?: string[],
) =>
  StyleSheet.create({
    containerStyle: {
      width: '100%',
      marginTop: MARGIN_TOP,
      borderRadius: BORDER_RADIUS,
      backgroundColor: isDarkMode ? colors.lightContent : colors.darkContent,
    },
    titleContainer: {
      flexDirection: 'row',
      width: '100%',
      backgroundColor: colors.bgColorComponentsLight,
      borderTopLeftRadius: BORDER_RADIUS,
      borderTopRightRadius: BORDER_RADIUS,
      borderColor: isDarkMode ? colors.lightContent : colors.darkContent,
    },
    tableContainer: {
      flexDirection: 'row',
      borderColor: isDarkMode ? colors.lightContent : colors.darkContent,
    },
    textStyle: {
      flex: 1,
      fontWeight: 'bold',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: FONT_SIZE,
      color: isDarkMode ? colors.darkContent : colors.lightContent,
      borderRightWidth:
        typeof index !== 'undefined' &&
        typeof row !== 'undefined' &&
        index < row.length - 1
          ? 1
          : 0,
      borderBottomWidth: 1,
      borderColor: isDarkMode ? colors.darkContent : colors.lightContent,
    },
    titleStyle: {
      flex: 1,
      fontWeight: 'bold',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: FONT_SIZE,
      borderBottomWidth: 1,
      color: isDarkMode ? colors.darkContent : colors.lightContent,
      borderRightWidth:
        typeof index !== 'undefined' && index < MAX_INDEX_FOR_BORDER ? 1 : 0,
      borderColor: isDarkMode ? colors.darkContent : colors.lightContent,
    },
    navigationView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    buttonStyle: {
      backgroundColor: colors.primary,
    },
    buttonTitleStyle: {
      color: isDarkMode ? colors.darkContent : colors.lightContent,
    },
  });
