import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {DarkModeService} from '../services/dark-mode.service';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const LoadingScreen = () => {
  const {isDarkMode} = DarkModeService.useDarkMode();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
      }}>
      <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
    </View>
  );
};

export default LoadingScreen;
