import React from 'react';
import {ButtonProps} from '../interfaces/button-props';
import {Button} from 'react-native';

const Vbutton: React.FC<ButtonProps> = ({buttonProps}: ButtonProps) => {
  return <Button {...buttonProps} />;
};

export default Vbutton;
