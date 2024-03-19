import React, {useEffect, useState} from 'react';
import {View, Text, Modal, Animated} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import {Alert} from '../interfaces/Valert';
import {alertStylesheet} from '../styles/Valert';

const VAlert: React.FC<Alert> = ({type, title, message}) => {
  const backgroundColor =
    type === 'error' ? '#ff4d4d' : type === 'warning' ? '#ffcc00' : '#3399ff';
  const [visible, setVisible] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <Animated.View
        style={{
          ...alertStylesheet.modalView,
          backgroundColor: backgroundColor,
          opacity: fadeAnim,
        }}>
        <View style={alertStylesheet.alertHeader}>
          <Icon name={type} type="material" color="#fff" />
          <Text style={alertStylesheet.alertTitle}>
            {title.toUpperCase()}
          </Text>
          <Button
            icon={<Icon name="close" size={18} color="#fff" />}
            type="clear"
            onPress={() => {
              setVisible(false);
            }}
          />
        </View>
        <Text style={alertStylesheet.alertMessage}>{message}</Text>
      </Animated.View>
    </Modal>
  );
};

export default VAlert;
