import React, {useContext} from 'react';
import {InputProps} from '../interfaces/Vinput';
import {Input} from 'react-native-elements';
import {inputStylesheet} from '../styles/Vinput';
import {DarkModeContext} from '../providers/dark-mode';
import {Color} from '../enums/color';

const VInput = ({inputProps}: InputProps) => {
  const {isDarkMode} = useContext(DarkModeContext);

  return (
    <Input
      ref={inputProps.ref}
      secureTextEntry={inputProps.secureTextEntry}
      blurOnSubmit={inputProps.blurOnSubmit}
      onFocus={inputProps.onFocus}
      onChangeText={inputProps.onChangeText}
      value={inputProps.value}
      placeholderTextColor={
        isDarkMode ? Color.placeholderDark : Color.placeholderLight
      }
      placeholder={inputProps.placeholder}
      keyboardType={inputProps.keyboardType}
      showSoftInputOnFocus={inputProps.showSoftInputOnFocus}
      autoFocus={inputProps.autoFocus}
      containerStyle={inputStylesheet(isDarkMode).containerStyle}
      rightIcon={inputProps.rightIcon}
      inputContainerStyle={inputStylesheet().inputContainerStyle}
      selectionColor={isDarkMode ? Color.lightContent : Color.darkContent}
      inputStyle={inputStylesheet(isDarkMode).inputStyle}
      onSubmitEditing={inputProps.onSubmitEditing}
    />
  );
};

export default VInput;