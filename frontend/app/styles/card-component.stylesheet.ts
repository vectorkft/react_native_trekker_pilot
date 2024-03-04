import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export const cardComponentStylesheet = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    margin: 10,
    borderRadius: 10,
  },
  cardBlack: {
    backgroundColor: Colors.darker,
  },
  darkTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  lightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  lightContent: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
    color: Colors.white,
  },
  darkContent: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
    color: Colors.dark,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  notFoundContent: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
    color: 'red',
  },
});
