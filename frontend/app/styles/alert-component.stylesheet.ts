import {StyleSheet} from 'react-native';

export const alertStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    borderRadius: 10, // Új sor
  },
  textContainer: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5, // Új sor
  },
  message: {
    fontWeight: 'bold',
    color: 'black',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  close: {
    marginLeft: 8,
  },
});
