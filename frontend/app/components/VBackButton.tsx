import {Icon} from 'react-native-elements';
import {RouterProps} from '../interfaces/navigation-props';
import {DarkModeProviderService} from '../services/context-providers.service';
import {TouchableOpacity} from 'react-native';
import {useStore} from '../states/zustand-states';
import {RouteProp, useRoute} from "@react-navigation/native";
import {StackParamList} from "../interfaces/stack-param-list";

const VBackButton = ({navigation}: RouterProps) => {
  const {isDarkMode} = DarkModeProviderService.useDarkMode();
  const {isConnected} = useStore.getState();
  const routeProducts = useRoute<RouteProp<StackParamList, 'products'>>();
  const styleButton = routeProducts.params.styleButton;

  return (
    <TouchableOpacity
      style={[{position: 'absolute',
          left: 5},styleButton && {top: 15}]}
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
