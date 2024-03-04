import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {RouterProps} from '../interfaces/navigation-props';
import {DarkModeService} from '../services/dark-mode.service';
import {backButtonStyles} from '../styles/back-button-component.stylesheet';

const BackButton = ({navigation}: RouterProps) => {
  const {isDarkMode} = DarkModeService.useDarkMode();

  return (
    <TouchableOpacity
      style={backButtonStyles.backButton}
      onPress={() => navigation.goBack()}>
      <Icon name="left" size={30} color={isDarkMode ? '#ffffff' : '#000000'} />
    </TouchableOpacity>
  );
};

export default BackButton;
