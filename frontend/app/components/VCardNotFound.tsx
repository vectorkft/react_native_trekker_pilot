import React from 'react';
import {CardPropsNotFound} from '../interfaces/card-props';
import {Text, View} from 'react-native';
import {VCardComponentStylesheet} from '../styles/vcard-component.stylesheet';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {DarkModeProviderService} from '../services/context-providers.service';

const VCardNotFound: React.FC<CardPropsNotFound> = ({
  title,
  ean,
}: CardPropsNotFound) => {
  const {isDarkMode} = DarkModeProviderService.useDarkMode();

  return (
    <View
      style={[
        VCardComponentStylesheet.cardContainer,
        {backgroundColor: isDarkMode ? Colors.white : Colors.darker},
      ]}>
      <Text style={[VCardComponentStylesheet.cardTitle, {color: '#ff0000'}]}>
        {title}
      </Text>
      <Text style={[VCardComponentStylesheet.cardTitle, {color: '#ff0000'}]}>
        EAN kód: {ean}
      </Text>
    </View>
  );
};

export default VCardNotFound;
