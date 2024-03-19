import {StyleSheet} from 'react-native';

export const internetToastStylesheet = StyleSheet.create({
  toast: {
    position: 'absolute',
    width: '90%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    bottom: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4, // Android árnyékolás
  },
});
