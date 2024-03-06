import React from 'react';
import {ButtonProps} from '../interfaces/button-props';
import {Button} from 'react-native-elements';
import {TouchableOpacity} from 'react-native';

const VButton: React.FC<ButtonProps> = ({
  buttonPropsNativeElement,
}: ButtonProps) => {
  return (
    <Button
      TouchableComponent={TouchableOpacity}
      title={buttonPropsNativeElement.title}
      titleStyle={buttonPropsNativeElement.titleStyle}
      buttonStyle={buttonPropsNativeElement.buttonStyle}
      containerStyle={buttonPropsNativeElement.containerStyle}
      onPress={buttonPropsNativeElement.onPress}
      activeOpacity={buttonPropsNativeElement.activeOpacity}
      disabled={buttonPropsNativeElement.disabled}
    />
  );
};

export default VButton;
