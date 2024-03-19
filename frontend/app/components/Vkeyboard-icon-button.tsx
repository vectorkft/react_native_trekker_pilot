import React, {useContext} from 'react';
import {TouchableOpacity} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {KeyboardManager} from '../interfaces/Vkeyboard';
import {DarkModeContext} from '../providers/dark-mode';

export default function VKeyboardIconButton({toggleKeyboard}: KeyboardManager) {
  const {isDarkMode} = useContext(DarkModeContext);

  return (
    <Button
      TouchableComponent={TouchableOpacity}
      icon={
        <Icon
          type="material"
          name="keyboard"
          size={50}
          color={isDarkMode ? '#ffffff' : '#000000'}
        />
      }
      onPress={toggleKeyboard}
      type="clear"
    />
  );
}
