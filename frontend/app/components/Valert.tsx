import React, {useEffect, useState} from 'react';
import {Animated, Modal, Text, View} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {Alert} from '../types/Valert';
import {alertStylesheet} from '../styles/Valert';
import {AlertType} from '../enums/type';
import {Color} from '../enums/color';

const VAlert: React.FC<Alert> = ({type, title, message}) => {
  const VALERT_ANIMATION_DURATION = 100;
  const backgroundColor =
    type === AlertType.error
      ? Color.error
      : type === AlertType.warning
      ? Color.warning
      : Color.message;
  const [visible, setVisible] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: VALERT_ANIMATION_DURATION,
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
          <Text style={alertStylesheet.alertTitle}>{title.toUpperCase()}</Text>
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
