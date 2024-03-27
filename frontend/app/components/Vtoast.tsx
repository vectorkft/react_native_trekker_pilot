import React, {useContext, useEffect, useState} from 'react';
import {Animated, Text, Dimensions} from 'react-native';
import {ToastProps} from '../interfaces/Vtoast';
import {Icon} from 'react-native-elements';
import {toastStylesheet} from '../styles/Vtoast';
import {DarkModeContext} from '../providers/dark-mode';
import {Color} from '../enums/color';

const VToast = ({isVisible, label, type, handleEvent}: ToastProps) => {
  const TIMEOUT_DELAY_TOAST = 2000;
  const VTOAST_ANIMATION_DURATION = 500;
  const [slideAnim] = useState(
    new Animated.Value(-Dimensions.get('window').height),
  );
  const {isDarkMode} = useContext(DarkModeContext);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: VTOAST_ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(() => {
        const timer = setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: -Dimensions.get('window').height,
            duration: VTOAST_ANIMATION_DURATION,
            useNativeDriver: true,
          }).start(() => {
            if (handleEvent) {
              handleEvent();
            }
          });
        }, TIMEOUT_DELAY_TOAST);

        return () => clearTimeout(timer);
      });
    }
  }, [handleEvent, isVisible, slideAnim]);

  return (
    <Animated.View
      style={{
        ...toastStylesheet(isDarkMode).toast,
        transform: [{translateY: slideAnim}],
      }}>
      <Text style={toastStylesheet(isDarkMode).vtoastLabel}>{label}</Text>
      <Icon
        name={type as string}
        type="material"
        color={isDarkMode ? Color.lightContent : Color.darkContent}
      />
    </Animated.View>
  );
};

export default VToast;
