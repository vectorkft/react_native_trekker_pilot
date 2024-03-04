import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export const styles = StyleSheet.create({
  lightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lighter,
  },
  darkContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.darker,
  },
  lightTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  darkTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  switchMode: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lightModeText: {
    fontSize: 16, // Kisebb méretű szöveg
    fontWeight: 'bold',
    color: '#000000',
  },
  darkModeText: {
    fontSize: 16, // Kisebb méretű szöveg
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
