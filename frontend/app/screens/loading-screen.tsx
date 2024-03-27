import React, {useContext} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {DarkModeContext} from '../providers/dark-mode';
import {loadingStyles} from '../styles/loading';
import {Color} from '../enums/color';

const LoadingScreen = () => {
  const {isDarkMode} = useContext(DarkModeContext);

  return (
    <View style={loadingStyles(isDarkMode).container}>
      <ActivityIndicator
        size="large"
        color={isDarkMode ? Color.lightContent : Color.darkContent}
      />
    </View>
  );
};

export default LoadingScreen;
