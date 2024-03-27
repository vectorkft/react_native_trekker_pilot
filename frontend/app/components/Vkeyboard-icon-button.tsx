import React, {useContext} from 'react';
import {TouchableOpacity} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {KeyboardManager} from '../interfaces/Vkeyboard';
import {DarkModeContext} from '../providers/dark-mode';
import {Color} from '../enums/color';

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
          color={isDarkMode ? Color.lightContent : Color.darkContent}
        />
      }
      onPress={toggleKeyboard}
      type="clear"
    />
  );
}
