import React from 'react';
import {ButtonProps} from '../interfaces/button-props';
import {Text, TouchableOpacity} from 'react-native';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import {buttonStyles} from '../styles/button-component.stylesheet';

const ButtonComponent: React.FC<ButtonProps> = ({
  label,
  enabled,
  onClick,
  isDarkModeOn,
  optional,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={!enabled}
      style={[
        buttonStyles.button,
        !isDarkModeOn && buttonStyles.buttonDisabled,
      ]}>
      <Text
        style={
          optional
            ? darkModeContent.darkModeText
            : isDarkModeOn
            ? darkModeContent.lightModeText
            : darkModeContent.darkModeText
        }>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonComponent;
