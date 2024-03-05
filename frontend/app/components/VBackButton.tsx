import Icon from 'react-native-vector-icons/AntDesign';
import {RouterProps} from '../interfaces/navigation-props';
import {DarkModeService} from '../services/dark-mode.service';
import {backButtonStyles} from '../styles/back-button-component.stylesheet';
import {IconButton} from 'native-base';

const VBackButton = ({navigation}: RouterProps) => {
  const {isDarkMode} = DarkModeService.useDarkMode();

  return (
    <IconButton
      style={backButtonStyles.backButton}
      icon={
        <Icon
          name="left"
          size={30}
          color={isDarkMode ? '#ffffff' : '#000000'}
        />
      }
      onPress={() => navigation.goBack()}
    />
  );
};

export default VBackButton;
