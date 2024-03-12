import React from 'react';
import {View, Text} from 'react-native';
import {cardComponentStylesheet} from '../styles/card-component.stylesheet';
import {CardProps} from '../interfaces/card-props';
import {DarkModeProviderService} from '../services/context-providers.service';

const CardComponentSuccess: React.FC<CardProps> = ({
  title,
  content,
}: CardProps) => {
  const {isDarkMode} = DarkModeProviderService.useDarkMode();

  return (
    <View
      style={[
        cardComponentStylesheet.card,
        !isDarkMode && cardComponentStylesheet.cardBlack,
      ]}>
      <Text
        style={
          isDarkMode
            ? cardComponentStylesheet.darkTitle
            : cardComponentStylesheet.lightTitle
        }>
        {title}
      </Text>
      <Text
        style={
          isDarkMode
            ? cardComponentStylesheet.darkContent
            : cardComponentStylesheet.lightContent
        }>
        Cikkszám: {content.cikkszam}
      </Text>
      <Text
        style={
          isDarkMode
            ? cardComponentStylesheet.darkContent
            : cardComponentStylesheet.lightContent
        }>
        Cikk neve: {content.cikknev}
      </Text>
      <Text
        style={
          isDarkMode
            ? cardComponentStylesheet.darkContent
            : cardComponentStylesheet.lightContent
        }>
        EAN kód: {content.eankod}
      </Text>
    </View>
  );
};
export default CardComponentSuccess;
