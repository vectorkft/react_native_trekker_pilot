import {StyleSheet} from 'react-native';

export const VDataTableStylesheet = StyleSheet.create({
  containerStyle: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#dcdcdc',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 1,
  },
  tableContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  textStyle: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
