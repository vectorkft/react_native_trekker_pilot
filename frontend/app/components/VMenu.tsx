import React, {useState, useContext} from 'react';
import {
  TouchableOpacity,
  Modal,
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import {DarkModeContext} from '../providers/dark-mode';
import {Button, Icon} from 'react-native-elements';
import {Color} from '../enums/color';
import menu from '../../../shared/menu/menu.json';
import VButton from './Vbutton';

const VMenu = () => {
  const {isDarkMode} = useContext(DarkModeContext);
  const [modalVisible, setModalVisible] = useState(false);

  const data = menu.data;

  return (
    <>
      <Button
        TouchableComponent={TouchableOpacity}
        icon={
          <Icon
            type="material"
            name="menu-open"
            size={50}
            color={isDarkMode ? Color.lightContent : Color.darkContent}
          />
        }
        onPress={() => setModalVisible(true)}
        type="clear"
      />
      <Modal
        animationType={'fade'}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FlatList
              data={[...data, {id: 'mode', hotkey: '', title: 'I - 0 Mód:'}]}
              renderItem={({item}) => {
                if (item.id === 'mode') {
                  return <Text style={styles.modeText}>{item.title}</Text>;
                } else {
                  return (
                    <View style={styles.item}>
                      <Text style={styles.hotkey}>{item.hotkey}</Text>
                      <Text style={styles.title}>{item.title}</Text>
                    </View>
                  );
                }
              }}
              keyExtractor={item => item.id}
            />
            <View style={styles.buttonContainer}>
              <VButton
                buttonPropsNativeElement={{
                  title: 'Bezárás',
                  titleStyle: {
                    fontFamily: 'Roboto',
                    fontSize: 20,
                    fontWeight: '700',
                    color: isDarkMode
                      ? Color.lightContent
                      : Color.darkContent,
                  },
                  buttonStyle: {
                    backgroundColor: Color.primary,
                    height: 50,
                    borderRadius: 10,
                  },
                  onPress: () => setModalVisible(false),
                }}
              />
            </View>
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
    backgroundColor: '#fff',
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    width: '90%',
    height: '85%',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  hotkey: {
    fontSize: 30,
    fontWeight: 'bold',
    marginRight: 10,
  },
  title: {
    fontSize: 30,
  },
  modeText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignSelf: 'stretch',
  },
});

export default VMenu;
