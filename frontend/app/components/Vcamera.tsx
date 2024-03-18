import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Icon, Button} from 'react-native-elements';
import {CameraScannerProps} from '../interfaces/vcamera-props';

const Vcamera = ({onScan, onClose}: CameraScannerProps) => {
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
        containerStyle={{position: 'absolute', top: 0, left: 0}}
        icon={
          <Icon type="antdesign" name="close" size={40} color={'#ffffff'} />
        }
        buttonStyle={{backgroundColor: 'transparent'}}
        onPress={onClose}
        TouchableComponent={TouchableOpacity}
      />
    </View>
  );
};

export default Vcamera;
