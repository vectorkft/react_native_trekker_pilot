import React from 'react';
import {Button, Icon} from 'react-native-elements';
import {useStore} from '../states/zustand';
import {TouchableOpacity} from 'react-native';
import {useContext} from 'react';
import {DarkModeContext} from '../providers/dark-mode';
import {CameraControl} from '../interfaces/Vcamera-button';
import {Color} from '../enums/color';

const VCameraIconButton = ({toggleCameraIcon}: CameraControl) => {
  const {isDarkMode} = useContext(DarkModeContext);
  const {isConnected} = useStore.getState();

  return (
    <Button
      disabled={!isConnected}
      TouchableComponent={TouchableOpacity}
      icon={
        <Icon
          type="antdesign"
          name="camera"
          size={50}
          color={isDarkMode ? Color.lightContent : Color.darkContent}
        />
      }
      onPress={toggleCameraIcon}
      type="clear"
    />
  );
};

export default VCameraIconButton;
