import React from 'react';
import {ButtonProps} from '../interfaces/button-props';
import {Button} from 'react-native';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import {buttonStyles} from '../styles/button-component.stylesheet';

const Vbutton: React.FC<ButtonProps> = ({buttonProps}: ButtonProps) => {
  return (
    // <TouchableOpacity
    //   onPress={onClick}
    //   disabled={!enabled}
    //   style={[
    //     buttonStyles.button,
    //     !isDarkModeOn && buttonStyles.buttonDisabled,
    //   ]}>
    //   <Text
    //     style={
    //       optional
    //         ? darkModeContent.darkModeText
    //         : isDarkModeOn
    //         ? darkModeContent.lightModeText
    //         : darkModeContent.darkModeText
    //     }>
    //     {label}
    //   </Text>
    // </TouchableOpacity>
    <Button
      onPress={buttonProps.onClick}
      title={buttonProps.label}
      disabled={!buttonProps.enabled}
      color={buttonProps.color}
      accessibilityLabel="Learn more about this purple button"
    />
  );
};

export default Vbutton;
