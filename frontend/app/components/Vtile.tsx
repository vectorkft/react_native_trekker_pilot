import React, {useContext} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {VtileProps} from '../interfaces/VtileProps';
import {VTileStylesheet} from '../styles/vtile.stylesheet';
import {DarkModeContext} from '../providers/dark-mode';

const Vtile = ({title, tileProps}: VtileProps) => {
  const {isDarkMode} = useContext(DarkModeContext);

  return (
    <TouchableOpacity
      onPress={tileProps.onPress}
      activeOpacity={0.5}
      disabled={tileProps.disabled}>
      <View
        style={[
          VTileStylesheet.tile,
          {backgroundColor: isDarkMode ? '#2d2d2d' : '#d2cfcf'},
        ]}>
        <Text
          style={[
            VTileStylesheet.title,
            {color: isDarkMode ? '#fff' : '#000'},
          ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Vtile;
