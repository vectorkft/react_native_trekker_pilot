import {Platform, StyleSheet} from 'react-native';

export const buttonStyles = StyleSheet.create({
  button: {
    padding: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    height: 40,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
    ...Platform.select({
      android: {
        elevation: 3,
      },
    }),
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#A9A9A9',
  },
});
