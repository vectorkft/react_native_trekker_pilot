import React, {useContext, useEffect, useState} from 'react';
import {Animated, Text, Dimensions} from 'react-native';
import {ToastProps} from '../interfaces/Vtoast';
import {darkModeContent} from '../styles/dark-mode-content';
import {Icon} from 'react-native-elements';
import {VToastStylesheet} from '../styles/vtoast';
import {DarkModeContext} from '../providers/dark-mode';

const VToast = ({isVisible, label, type, handleEvent}: ToastProps) => {
  const [slideAnim] = useState(
    new Animated.Value(-Dimensions.get('window').height),
  );
  const {isDarkMode} = useContext(DarkModeContext);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        const timer = setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: -Dimensions.get('window').height,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            if (handleEvent) {
              handleEvent();
            }
          });
        }, 2000);

        return () => clearTimeout(timer);
      });
    }
  }, [handleEvent, isVisible, slideAnim]);

  return (
    <Animated.View
      style={{
        ...VToastStylesheet.toast,
        transform: [{translateY: slideAnim}],
        backgroundColor: isDarkMode ? '#343333' : '#a9a4a4',
      }}>
      <Text
        style={
          isDarkMode
            ? darkModeContent.darkModeText
            : darkModeContent.lightModeText
        }>
        {label}
      </Text>
      <Icon
        name={type || 'info-outline'}
        type="material"
        color={isDarkMode ? '#fff' : '#000'}
      />
    </Animated.View>
  );
};

export default VToast;
