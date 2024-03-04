import {StyleSheet, Platform} from 'react-native';

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
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ddd',
  },
});
