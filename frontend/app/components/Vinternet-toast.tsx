import React, {useContext, useEffect, useState} from 'react';
import {Animated, Text, Dimensions, ActivityIndicator} from 'react-native';
import {ToastProps} from '../interfaces/Vtoast';
import {Icon} from 'react-native-elements';
import {internetToastStylesheet} from '../styles/Vinternet-toast';
import {DarkModeContext} from '../providers/dark-mode';
import {Color} from '../enums/color';

const VInternetToast = ({isVisible}: ToastProps) => {
  const VTOAST_ANIMATION_DURATION = 500;
  const [slideAnim] = useState(
    new Animated.Value(Dimensions.get('window').height),
  );
  const {isDarkMode} = useContext(DarkModeContext);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : Dimensions.get('window').height,
      duration: VTOAST_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  }, [isVisible, slideAnim]);

  return (
    <Animated.View
      style={{
        ...internetToastStylesheet().toast,
        transform: [{translateY: slideAnim}],
      }}>
      <Icon
        type="antdesign"
        name="exclamationcircleo"
        size={25}
        color={isDarkMode ? Color.lightContent : Color.darkContent}
      />
      <Text style={internetToastStylesheet(isDarkMode).textStyle}>
        Nincs internetkapcsolat
      </Text>
      <ActivityIndicator
        size={30}
        color={isDarkMode ? Color.lightContent : Color.darkContent}
        style={internetToastStylesheet().activityIndicatorStyle}
      />
    </Animated.View>
  );
};

export default VInternetToast;
