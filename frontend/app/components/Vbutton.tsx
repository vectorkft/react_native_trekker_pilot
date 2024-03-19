import React from 'react';
import {ButtonPropsNativeElement} from '../interfaces/Vbutton';
import {Button} from 'react-native-elements';
import {TouchableOpacity} from 'react-native';

const VButton: React.FC<ButtonPropsNativeElement> = ({
  buttonPropsNativeElement,
}: ButtonPropsNativeElement) => {
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
