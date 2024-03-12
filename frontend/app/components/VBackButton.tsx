import {Icon} from 'react-native-elements';
import {RouterProps} from '../interfaces/navigation-props';
import {DarkModeProviderService} from '../services/context-providers.service';
import {backButtonStyles} from '../styles/back-button-component.stylesheet';
import {TouchableOpacity} from 'react-native';
import {useStore} from '../states/zustand-states';

const VBackButton = ({navigation}: RouterProps) => {
  const {isDarkMode} = DarkModeProviderService.useDarkMode();
  const {isConnected} = useStore.getState();

  return (
    <TouchableOpacity
      style={backButtonStyles.backButton}
      disabled={!isConnected}
      onPress={() => navigation.goBack()}>
      <Icon
        name="left"
        type="antdesign"
        size={35}
        color={isDarkMode ? '#ffffff' : '#000000'}
      />
    </TouchableOpacity>
  );
};

export default VBackButton;
