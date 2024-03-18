import React from 'react';
import {VbuttonProps} from '../interfaces/Vbutton';
import {Button} from 'react-native-elements';
import {TouchableOpacity} from 'react-native';

const Vbutton: React.FC<VbuttonProps> = ({
  buttonPropsNativeElement,
}: VbuttonProps) => {
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

export default Vbutton;
