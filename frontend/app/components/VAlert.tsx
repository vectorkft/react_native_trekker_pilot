import React, {useEffect, useState} from 'react';
import {View, Text, Modal, StyleSheet, Animated} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import {AlertProps} from '../interfaces/alert-props';

const VAlert: React.FC<AlertProps> = ({type, title, message}) => {
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
          ...styles.modalView,
          backgroundColor: backgroundColor,
          opacity: fadeAnim,
        }}>
        <View style={styles.alertHeader}>
          <Icon name={type} type="material" color="#fff" />
          <Text style={styles.alertTitle}>{title.toUpperCase()}</Text>
          <Button
            icon={<Icon name="close" size={18} color="#fff" />}
            type="clear"
            onPress={() => {
              setVisible(false);
            }}
          />
        </View>
        <Text style={styles.alertMessage}>{message}</Text>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  alertTitle: {
    fontWeight: 'bold',
    color: '#fff',
  },
  alertMessage: {
    marginTop: 15,
    color: '#fff',
    textAlign: 'center',
  },
});

export default VAlert;
