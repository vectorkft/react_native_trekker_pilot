import {Icon} from 'react-native-elements';
import {RouterProps} from '../interfaces/navigation-props';
import {DarkModeService} from '../services/dark-mode.service';
import {backButtonStyles} from '../styles/back-button-component.stylesheet';
import {TouchableOpacity} from 'react-native';

const VBackButton = ({navigation}: RouterProps) => {
  const {isDarkMode} = DarkModeService.useDarkMode();

  return (
    <TouchableOpacity
      style={backButtonStyles.backButton}
      onPress={() => navigation.goBack()}>
      <Icon
        name="left"
        type="antdesign"
        size={30}
        color={isDarkMode ? '#ffffff' : '#000000'}
      />
    </TouchableOpacity>
  );
};

export default VBackButton;
