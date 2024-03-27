import React from 'react';
import {Icon} from 'react-native-elements';
import {AppNavigation} from '../interfaces/navigation';
import {TouchableOpacity} from 'react-native';
import {useStore} from '../states/zustand';
import {RouteProp, useRoute} from '@react-navigation/native';
import {UIConfig} from '../types/u-i-config';
import {useContext} from 'react';
import {DarkModeContext} from '../providers/dark-mode';
import {vbackButton} from '../styles/Vback-button';
import {Color} from '../enums/color';

const VBackButton = ({navigation}: AppNavigation) => {
  const {isDarkMode} = useContext(DarkModeContext);
  const {isConnected} = useStore.getState();
  const routeProducts = useRoute<RouteProp<UIConfig, 'products'>>();
  const styleButton = routeProducts.params.styleButton;

  return (
    <TouchableOpacity
      style={vbackButton(styleButton).positionHeader}
      disabled={!isConnected}
      onPress={() => navigation.goBack()}>
      <Icon
        name="left"
        type="antdesign"
        size={35}
        color={isDarkMode ? Color.lightContent : Color.darkContent}
      />
    </TouchableOpacity>
  );
};

export default VBackButton;
