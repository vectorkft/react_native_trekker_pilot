import {Icon} from 'react-native-elements';
import {RouterProps} from '../interfaces/navigation';
import {TouchableOpacity} from 'react-native';
import {useStore} from '../states/zustand-states';
import {RouteProp, useRoute} from '@react-navigation/native';
import {StackParamList} from '../interfaces/stack-param-list';
import {useContext} from 'react';
import {DarkModeContext} from '../providers/dark-mode';

const VbackButton = ({navigation}: RouterProps) => {
  const {isDarkMode} = useContext(DarkModeContext);
  const {isConnected} = useStore.getState();
  const routeProducts = useRoute<RouteProp<StackParamList, 'products'>>();
  const styleButton = routeProducts.params.styleButton;

  return (
    <TouchableOpacity
      style={[{position: 'absolute', left: 5}, styleButton && {top: 15}]}
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

export default VbackButton;
