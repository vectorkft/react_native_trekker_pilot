import React from 'react';
import {VinputProps} from '../interfaces/vinput-props';
import {DarkModeService} from '../services/dark-mode.service';
import {Input} from 'react-native-elements';

const VInput = ({inputProps}: VinputProps) => {
  const {isDarkMode} = DarkModeService.useDarkMode();

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
      containerStyle={{
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: isDarkMode ? '#343333' : '#dcdcdc',
        height: 50,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
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
