import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {RouterProps} from '../interfaces/navigation-props';
import {DarkModeService} from '../services/dark-mode.service';

const BackButton = ({navigation}: RouterProps) => {
  const {isDarkMode} = DarkModeService.useDarkMode();

  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}>
      <Icon name="left" size={30} color={isDarkMode ? '#ffffff' : '#000000'} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 10, // Adjust as needed
    left: 10, // Adjust as needed
  },
});

export default BackButton;
