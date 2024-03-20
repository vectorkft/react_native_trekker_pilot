import React, {useContext, useEffect, useState} from 'react';
import {Animated, Text, Dimensions, ActivityIndicator} from 'react-native';
import {ToastProps} from '../interfaces/Vtoast';
import {Icon} from 'react-native-elements';
import {internetToastStylesheet} from '../styles/Vinternet-toast';
import {DarkModeContext} from '../providers/dark-mode';
import {VTOAST_ANIMATION_DURATION} from '../constants/time';
import {colors} from '../enums/colors';

const VInternetToast = ({isVisible}: ToastProps) => {
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
        color={isDarkMode ? colors.lightContent : colors.darkContent}
      />
      <Text style={internetToastStylesheet(isDarkMode).textStyle}>
        Nincs internetkapcsolat
      </Text>
      <ActivityIndicator
        size={30}
        color={isDarkMode ? colors.lightContent : colors.darkContent}
        style={internetToastStylesheet().activityIndicatorStyle}
      />
    </Animated.View>
  );
};

export default VInternetToast;
