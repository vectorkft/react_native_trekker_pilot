import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export const darkModeContent = StyleSheet.create({
  lightContainer: {
    flex: 1,
    backgroundColor: Colors.lighter,
  },
  darkContainer: {
    flex: 1,
    backgroundColor: Colors.darker,
  },
  lightTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },
  darkTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
  },
  lightModeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  darkModeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
  switchMode: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
