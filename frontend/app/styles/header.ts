import {StyleSheet} from 'react-native';

const HEADER_PADDING_HORIZONTAL = 10;
const HEADER_PADDING_VERTICAL = 10;
const ICON_BUTTON_MARGIN_HORIZONTAL = 10;

export const headerStylesheet = (isDarkMode?: boolean) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: HEADER_PADDING_HORIZONTAL,
      paddingVertical: HEADER_PADDING_VERTICAL,
      borderBottomWidth: 1,
      borderColor: '#00EDAE',
      backgroundColor: isDarkMode ? '#2d2d2d' : '#d2cfcf',
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flex: 1,
    },
    iconButton: {
      marginHorizontal: ICON_BUTTON_MARGIN_HORIZONTAL,
    },
  });
