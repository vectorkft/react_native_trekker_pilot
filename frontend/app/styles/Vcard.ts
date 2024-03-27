import {StyleSheet} from 'react-native';
import {Color} from '../enums/color';

const SCROLL_VIEW_PADDING_BOTTOM = 80;
const CARD_CONTAINER_MARGIN_TOP = 15;
const CARD_CONTAINER_BORDER_RADIUS = 10;
const PADDING = 10;
const CARD_TITLE_FONT_SIZE = 20;
const ITEM_CONTAINER_MARGIN_TOP = 10;
const ITEM_TITLE_FONT_SIZE = 16;
const ITEM_VALUE_FONT_SIZE = 16;

export const cardStylesheet = (isDarkMode?: boolean) =>
  StyleSheet.create({
    scrollView: {
      paddingBottom: SCROLL_VIEW_PADDING_BOTTOM,
    },
    cardContainer: {
      marginTop: CARD_CONTAINER_MARGIN_TOP,
      borderRadius: CARD_CONTAINER_BORDER_RADIUS,
      padding: PADDING,
      width: '100%',
      alignSelf: 'center',
      backgroundColor: isDarkMode ? Color.lightContent : Color.darkContent,
    },
    cardTitle: {
      fontSize: CARD_TITLE_FONT_SIZE,
      fontWeight: 'bold',
      color: isDarkMode ? Color.darkContent : Color.lightContent,
    },
    cardTitleNotFound: {
      fontSize: CARD_TITLE_FONT_SIZE,
      fontWeight: 'bold',
      color: Color.error,
    },
    itemContainer: {
      marginTop: ITEM_CONTAINER_MARGIN_TOP,
    },
    itemTitle: {
      fontSize: ITEM_TITLE_FONT_SIZE,
      fontWeight: 'bold',
      color: isDarkMode ? Color.darkContent : Color.lightContent,
    },
    itemValue: {
      fontSize: ITEM_VALUE_FONT_SIZE,
      color: isDarkMode ? Color.darkContent : Color.lightContent,
    },
  });
