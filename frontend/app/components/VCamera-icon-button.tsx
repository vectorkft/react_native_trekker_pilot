import {Button, Icon} from 'react-native-elements';
import {DarkModeProviderService} from '../services/context-providers.service';
import {useStore} from '../states/zustand-states';

const VCameraIconButton = ({onPress}: any) => {
  const {isDarkMode} = DarkModeProviderService.useDarkMode();
  const {isConnected} = useStore.getState();

  return (
    <Button
      disabled={!isConnected}
      icon={
        <Icon
          type="antdesign"
          name="camera"
          size={50}
          color={isDarkMode ? '#ffffff' : '#000000'}
        />
      }
      onPress={onPress}
      type="clear"
    />
  );
};

export default VCameraIconButton;
