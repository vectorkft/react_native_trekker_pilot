import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Icon, Button} from 'react-native-elements';
import {ScannerProps} from '../interfaces/Vcamera';
import {vcamera} from '../styles/Vcamera';
import {Color} from '../enums/color';

const VCamera = ({onScan, onClose}: ScannerProps) => {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <RNCamera
        onBarCodeRead={onScan}
        style={StyleSheet.absoluteFillObject}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        autoFocus={RNCamera.Constants.AutoFocus.on}
        zoom={0}
      />
      <Button
        containerStyle={vcamera.buttonPosition}
        icon={
          <Icon
            type="antdesign"
            name="close"
            size={40}
            color={Color.lightContent}
          />
        }
        buttonStyle={vcamera.buttonStyle}
        onPress={onClose}
        TouchableComponent={TouchableOpacity}
      />
    </View>
  );
};

export default VCamera;
