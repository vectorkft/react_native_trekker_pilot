import {Icon} from 'react-native-elements';
import {AppNavigation} from '../interfaces/navigation';
import {TouchableOpacity} from 'react-native';
import {useStore} from '../states/zustand';
import {RouteProp, useRoute} from '@react-navigation/native';
import {UIConfig} from '../interfaces/u-i-config';
import {useContext} from 'react';
import {DarkModeContext} from '../providers/dark-mode';

const VBackButton = ({navigation}: AppNavigation) => {
  const {isDarkMode} = useContext(DarkModeContext);
  const {isConnected} = useStore.getState();
  const routeProducts = useRoute<RouteProp<UIConfig, 'products'>>();
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

export default VBackButton;
