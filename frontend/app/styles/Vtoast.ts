import {StyleSheet} from 'react-native';

export const toastStylesheet = StyleSheet.create({
  toast: {
    zIndex: 1,
    position: 'absolute',
    width: '90%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    top: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
});
