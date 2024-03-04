import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, Animated, View} from 'react-native';
import {AlertProps} from '../interfaces/alert-props';
import Icon from 'react-native-vector-icons/AntDesign';
import {alertStyles} from '../styles/alert-component.stylesheet';

const AlertComponent: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onClose,
}) => {
  const backgroundColor =
    type === 'error' ? '#ff4d4d' : type === 'warning' ? '#ffcc00' : '#3399ff';
  const [offset] = useState(new Animated.Value(-100));

  useEffect(() => {
    Animated.timing(offset, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  });

  return (
    <Animated.View
      style={[
        alertStyles.container,
        {backgroundColor, transform: [{translateY: offset}]},
      ]}>
      <View style={alertStyles.textContainer}>
        <Text style={alertStyles.title}>{title.toUpperCase()}</Text>
        <Text style={alertStyles.message}>{message}</Text>
      </View>
      <TouchableOpacity style={alertStyles.closeButton} onPress={onClose}>
        <Icon name="close" size={20} color={'#000'} style={alertStyles.close} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AlertComponent;
