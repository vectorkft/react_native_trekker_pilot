import React, {useContext} from 'react';
import {VCardNotFound} from '../interfaces/Vcard';
import {Text, View} from 'react-native';
import {VCardComponentStylesheet} from '../styles/vcard-component.stylesheet';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {DarkModeContext} from '../providers/dark-mode';

const VcardNotFound: React.FC<VCardNotFound> = ({
  title,
  value,
}: VCardNotFound) => {
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
