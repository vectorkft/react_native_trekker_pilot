import React, {useContext} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {DarkModeContext} from '../providers/dark-mode';
import {loadingStyles} from '../styles/loading';
import {colors} from '../enums/colors';

const LoadingScreen = () => {
  const {isDarkMode} = useContext(DarkModeContext);

  return (
    <View style={loadingStyles(isDarkMode).container}>
      <ActivityIndicator
        size="large"
        color={isDarkMode ? colors.lightContent : colors.darkContent}
      />
    </View>
  );
};

export default LoadingScreen;
