import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export const formStylesheet = StyleSheet.create({
  inputContainer: {
    width: '90%',
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  input: {
    color: '#fff',
    height: 40,
    borderColor: '#c4c2c2',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '90%',
  },
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
});
