import {Button, Icon} from 'react-native-elements';
import {useStore} from '../states/zustand';
import {TouchableOpacity} from 'react-native';
import {useContext} from 'react';
import {DarkModeContext} from '../providers/dark-mode';
import {CameraControl} from '../interfaces/Vcamera-button';

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
          color={isDarkMode ? '#ffffff' : '#000000'}
        />
      }
      onPress={toggleCameraIcon}
      type="clear"
    />
  );
};

export default VCameraIconButton;
