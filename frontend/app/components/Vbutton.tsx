import React from 'react';
import {ButtonProps} from '../interfaces/button-props';
import {Text, TouchableOpacity} from 'react-native';
import {buttonStyles} from '../styles/button-component.stylesheet';
import {DarkModeService} from '../services/dark-mode.service';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';

const Vbutton: React.FC<ButtonProps> = ({buttonProps}: ButtonProps) => {
  const {isDarkMode} = DarkModeService.useDarkMode();

  return (
    <TouchableOpacity
      onPress={buttonProps.onPress}
      disabled={buttonProps.disabled}
      style={[
        buttonStyles.button,
        {backgroundColor: buttonProps.color},
        buttonProps.disabled && buttonStyles.buttonDisabled,
      ]}>
      <Text
        style={[
          isDarkMode
            ? darkModeContent.lightModeText
            : darkModeContent.darkModeText,
        ]}>
        {buttonProps.title}
      </Text>
    </TouchableOpacity>
  );
};

export default Vbutton;
