import React, {useContext} from 'react';
import {CardPropsNotFound} from '../interfaces/card-props';
import {Text, View} from 'react-native';
import {VCardComponentStylesheet} from '../styles/vcard-component.stylesheet';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {DarkModeContext} from '../providers/dark-mode';

const VcardNotFound: React.FC<CardPropsNotFound> = ({
  title,
  value,
}: CardPropsNotFound) => {
  const {isDarkMode} = useContext(DarkModeContext);

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
        EAN kód: {value}
      </Text>
    </View>
  );
};

export default VcardNotFound;
