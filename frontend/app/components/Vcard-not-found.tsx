import React, {useContext} from 'react';
import {CardNotFound} from '../interfaces/Vcard';
import {Text, View} from 'react-native';
import {cardStylesheet} from '../styles/Vcard';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {DarkModeContext} from '../providers/dark-mode';

const VCardNotFound: React.FC<CardNotFound> = ({
  title,
  value,
}: CardNotFound) => {
  const {isDarkMode} = useContext(DarkModeContext);

  return (
    <View
      style={[
        cardStylesheet.cardContainer,
        {backgroundColor: isDarkMode ? Colors.white : Colors.darker},
      ]}>
      <Text style={[cardStylesheet.cardTitle, {color: '#ff0000'}]}>
        {title}
      </Text>
      <Text style={[cardStylesheet.cardTitle, {color: '#ff0000'}]}>
        EAN kód: {value}
      </Text>
    </View>
  );
};

export default VCardNotFound;
