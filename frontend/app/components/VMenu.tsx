import React, {useState, useContext} from 'react';
import {TouchableOpacity, Modal, View, Text, StyleSheet} from 'react-native';
import {DarkModeContext} from '../providers/dark-mode';
import {Button, Icon} from 'react-native-elements';
import {colors} from '../enums/colors';

const VMenu = () => {
  const {isDarkMode} = useContext(DarkModeContext);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Button
        TouchableComponent={TouchableOpacity}
        icon={
          <Icon
            type="material"
            name="menu-open"
            size={50}
            color={isDarkMode ? colors.lightContent : colors.darkContent}
          />
        }
        onPress={() => setModalVisible(true)}
        type="clear"
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Modal tartalma</Text>
            <Button title="Bezárás" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Átfedő réteg színe
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
});

export default VMenu;
