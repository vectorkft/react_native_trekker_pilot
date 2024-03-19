import {StyleSheet} from 'react-native';

export const VCardComponentStylesheet = StyleSheet.create({
  scrollView: {
    paddingBottom: 80,
  },
  cardContainer: {
    marginTop: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    padding: 10,
    width: '100%',
    alignSelf: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemContainer: {
    marginTop: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemValue: {
    fontSize: 16,
  },
});
