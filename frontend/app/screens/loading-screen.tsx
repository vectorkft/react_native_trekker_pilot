import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {DarkModeProviderService} from '../services/context-providers.service';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const LoadingScreen = () => {
  const {isDarkMode} = DarkModeProviderService.useDarkMode();

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
