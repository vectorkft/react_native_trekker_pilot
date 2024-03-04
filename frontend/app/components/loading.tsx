import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import {LoadingProps} from '../interfaces/loading-props';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const Loading = ({isDarkModeOn}: LoadingProps) => {
  return (
    <View
      style={
        isDarkModeOn
          ? darkModeContent.darkContainer
          : darkModeContent.lightContainer
      }>
      <ActivityIndicator
        size="large"
        color={isDarkModeOn ? Colors.white : Colors.black}
      />
    </View>
  );
};

export default Loading;
