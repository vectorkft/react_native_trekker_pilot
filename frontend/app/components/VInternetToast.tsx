import React, {useEffect, useState} from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {VtoastProps} from '../interfaces/vtoast-props';
import {DarkModeProviderService} from '../services/context-providers.service';
import {Icon} from 'react-native-elements';
import {VInternetToastStylesheet} from "../styles/vinternet-toast.stylesheet";

const VInternetToast = ({isVisible}: VtoastProps) => {
  const [slideAnim] = useState(
    new Animated.Value(Dimensions.get('window').height),
  );
  const {isDarkMode} = DarkModeProviderService.useDarkMode();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : Dimensions.get('window').height,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isVisible, slideAnim]);

  return (
    <Animated.View
      style={{
        ...VInternetToastStylesheet.toast,
        transform: [{translateY: slideAnim}],
        backgroundColor: isDarkMode ? '#343333' : '#a9a4a4',
      }}>
      <Icon
        type="antdesign"
        name="exclamationcircleo"
        size={25}
        color={isDarkMode ? '#ffffff' : '#000000'}
      />
      <Text
        style={{
          color: isDarkMode ? '#fff' : '#000',
          fontSize: 15,
          marginLeft: 15,
          fontWeight: 'bold',
        }}>
        Nincs internetkapcsolat
      </Text>
      <ActivityIndicator
        size={30}
        color={isDarkMode ? '#fff' : '#000'}
        style={{marginLeft: 15}}
      />
    </Animated.View>
  );
};



export default VInternetToast;
