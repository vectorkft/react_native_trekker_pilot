import React from 'react';
import {VinputProps} from '../interfaces/vinput-props';
import {DarkModeProviderService} from '../services/context-providers.service';
import {Input} from 'react-native-elements';
import {VInputComponentStylesheet} from '../styles/vinput-component.stylesheet';

const VInput = ({inputProps}: VinputProps) => {
  const {isDarkMode} = DarkModeProviderService.useDarkMode();

  return (
    <Input
      ref={inputProps.ref}
      secureTextEntry={inputProps.secureTextEntry}
      blurOnSubmit={inputProps.blurOnSubmit}
      onFocus={inputProps.onFocus}
      onChangeText={inputProps.onChangeText}
      value={inputProps.value}
      placeholderTextColor={isDarkMode ? '#5b5959' : '#a9a4a4'}
      placeholder={inputProps.placeholder}
      keyboardType={inputProps.keyboardType}
      showSoftInputOnFocus={inputProps.showSoftInputOnFocus}
      autoFocus={inputProps.autoFocus}
      containerStyle={[
        VInputComponentStylesheet.containerStyle,
        {backgroundColor: isDarkMode ? '#343333' : '#dcdcdc'},
      ]}
      rightIcon={inputProps.rightIcon}
      inputContainerStyle={{borderBottomWidth: 0}}
      selectionColor={isDarkMode ? '#fff' : '#000'}
      inputStyle={{
        color: isDarkMode ? '#fff' : '#000',
        textAlignVertical: 'center',
      }}
      onSubmitEditing={inputProps.onSubmitEditing}
    />
  );
};

export default VInput;
