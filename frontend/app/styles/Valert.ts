import {StyleSheet} from 'react-native';

export const alertStylesheet = StyleSheet.create({
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
