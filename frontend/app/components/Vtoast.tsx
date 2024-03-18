import React, {useContext, useEffect, useState} from 'react';
import {Animated, Text, Dimensions} from 'react-native';
import {VtoastProps} from '../interfaces/VtoastProps';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import {Icon} from 'react-native-elements';
import {VToastStylesheet} from '../styles/vtoast.stylesheet';
import {DarkModeContext} from '../providers/dark-mode';

const Vtoast = ({isVisible, label, type, handleEvent}: VtoastProps) => {
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

export default Vtoast;
