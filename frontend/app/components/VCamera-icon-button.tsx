import {DarkModeService} from '../services/dark-mode.service';
import {IconButton} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';

const VCameraIconButton = ({onPress}: any) => {
  const {isDarkMode} = DarkModeService.useDarkMode();
  return (
    <IconButton
      icon={
        <Icon
          name="camera"
          size={50}
          color={isDarkMode ? '#ffffff' : '#000000'}
        />
      }
      onPress={onPress}
    />
  );
};

export default VCameraIconButton;
