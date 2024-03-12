import React, {useEffect, useState} from 'react';
import {Animated, Text, StyleSheet, Dimensions} from 'react-native';
import {VtoastProps} from '../interfaces/vtoast-props';
import {DarkModeProviderService} from '../services/context-providers.service';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import {Icon} from 'react-native-elements';

const Toast = ({isVisible, label, type}: VtoastProps) => {
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
          }).start();
        }, 2000);

        return () => clearTimeout(timer);
      });
    }
  }, [isVisible, slideAnim]);

  return (
    <Animated.View
      style={{
        ...styles.toast,
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

const styles = StyleSheet.create({
  toast: {
    zIndex: 1,
    position: 'absolute',
    width: '90%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    top: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default Toast;
