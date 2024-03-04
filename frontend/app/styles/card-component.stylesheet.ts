import {StyleSheet} from 'react-native';
export const cardComponentStylesheet = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
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
