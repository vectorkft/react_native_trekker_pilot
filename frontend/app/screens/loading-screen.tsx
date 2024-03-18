import React, {useContext} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {DarkModeContext} from '../providers/dark-mode';

const LoadingScreen = () => {
  const {isDarkMode} = useContext(DarkModeContext);

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
