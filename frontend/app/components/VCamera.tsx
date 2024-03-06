import React from 'react';
import {View, StyleSheet} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/AntDesign';
import {backButtonStyles} from '../styles/back-button-component.stylesheet';
import {IconButton} from 'native-base';
import {DarkModeService} from '../services/dark-mode.service';
import {CameraScannerProps} from '../interfaces/vcamera-props';

const VCamera = ({onScan, isCameraActive, onClose}: CameraScannerProps) => {
  const {isDarkMode} = DarkModeService.useDarkMode();
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <RNCamera
        onBarCodeRead={isCameraActive ? onScan : undefined}
        style={StyleSheet.absoluteFillObject}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        autoFocus={RNCamera.Constants.AutoFocus.on}
        zoom={0}
      />
      <IconButton
        style={backButtonStyles.backButton}
        icon={
          <Icon
            name="close"
            size={30}
            color={isDarkMode ? '#ffffff' : '#000000'}
          />
        }
        onPress={onClose}
      />
    </View>
  );
};

export default VCamera;
