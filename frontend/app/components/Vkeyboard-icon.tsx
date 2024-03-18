import React, {useContext} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {VKeyboardProps} from '../interfaces/vkeyboard-props';
import {DarkModeContext} from '../providers/dark-mode';

export default function VKeyboardIcon({toggleKeyboard}: VKeyboardProps) {
  const {isDarkMode} = useContext(DarkModeContext);

  return (
    <View>
      <Icon
        type="material"
        name="keyboard"
        size={50}
        Component={TouchableOpacity}
        color={isDarkMode ? '#fff' : '#000'}
        onPress={toggleKeyboard}
      />
    </View>
  );
}
