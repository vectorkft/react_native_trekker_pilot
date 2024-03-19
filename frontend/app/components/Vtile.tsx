import React, {useContext} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {TileButton} from '../interfaces/Vtile';
import {tileStylesheet} from '../styles/Vtile';
import {DarkModeContext} from '../providers/dark-mode';

const VTile = ({title, tileProps}: TileButton) => {
  const {isDarkMode} = useContext(DarkModeContext);

  return (
    <TouchableOpacity
      onPress={tileProps.onPress}
      activeOpacity={0.5}
      disabled={tileProps.disabled}>
      <View
        style={[
          tileStylesheet.tile,
          {backgroundColor: isDarkMode ? '#2d2d2d' : '#d2cfcf'},
        ]}>
        <Text
          style={[
            tileStylesheet.title,
            {color: isDarkMode ? '#fff' : '#000'},
          ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default VTile;
