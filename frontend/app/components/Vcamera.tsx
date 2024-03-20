import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Icon, Button} from 'react-native-elements';
import {ScannerInterface} from '../interfaces/Vcamera';
import {vcamera} from '../styles/Vcamera';
import {colors} from '../enums/colors';

const VCamera = ({onScan, onClose}: ScannerInterface) => {
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
            color={colors.lightContent}
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
