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
        ...styles.toast,
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

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    width: '90%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    bottom: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4, // Android árnyékolás
  },
});

export default VInternetToast;
