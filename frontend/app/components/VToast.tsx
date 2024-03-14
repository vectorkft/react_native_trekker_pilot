import React, {useEffect, useState} from 'react';
import {Animated, Text, StyleSheet, Dimensions} from 'react-native';
import {VtoastProps} from '../interfaces/vtoast-props';
import {DarkModeProviderService} from '../services/context-providers.service';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import {Icon} from 'react-native-elements';
import {VToastStylesheet} from "../styles/vtoast.stylesheet";

const Toast = ({isVisible, label, type, handleEvent}: VtoastProps) => {
  const [slideAnim] = useState(
    new Animated.Value(-Dimensions.get('window').height),
  );
  const {isDarkMode} = DarkModeProviderService.useDarkMode();

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
            if (handleEvent){
              handleEvent();
            }
          });
        }, 2000);

        return () => clearTimeout(timer);
      });
    }
  }, [isVisible, slideAnim]);

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

export default Toast;
