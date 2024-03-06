import React from 'react';
import {TextInput, Keyboard} from 'react-native';
import {articleStyles} from '../styles/products.stylesheet';
import {VinputProps} from '../interfaces/vinput-props';

const VInput = ({
  value,
  onChangeWhenReadOnly,
  onChangeWhenEditable,
  readOnly,
}: VinputProps) => {
  return (
    <TextInput
      style={articleStyles.input}
      onFocus={() => readOnly && Keyboard.dismiss()}
      onChangeText={readOnly ? onChangeWhenReadOnly : onChangeWhenEditable}
      value={value}
      placeholder="Keresés..."
      keyboardType="numeric"
      autoFocus
    />
  );
};

export default VInput;
