import {StyleSheet, Platform} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export const buttonStyles = StyleSheet.create({
  button: {
    backgroundColor: '#ffffff',
    padding: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    height: 40,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
    position: 'relative',
    ...Platform.select({
      android: {
        elevation: 3,
      },
    }),
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: Colors.darker,
  },
});
