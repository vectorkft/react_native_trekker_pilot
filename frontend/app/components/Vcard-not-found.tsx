import React, {useContext} from 'react';
import {CardNotFound} from '../interfaces/Vcard';
import {Text, View} from 'react-native';
import {cardStylesheet} from '../styles/Vcard';
import {DarkModeContext} from '../providers/dark-mode';

const VCardNotFound: React.FC<CardNotFound> = ({
  title,
  value,
}: CardNotFound) => {
  const {isDarkMode} = useContext(DarkModeContext);

  return (
    <View style={cardStylesheet(isDarkMode).cardContainer}>
      <Text style={cardStylesheet().cardTitleNotFound}>{title}</Text>
      <Text style={cardStylesheet().cardTitleNotFound}>Kód: {value}</Text>
    </View>
  );
};

export default VCardNotFound;
