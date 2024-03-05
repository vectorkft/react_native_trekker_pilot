import React from 'react';
import {Box, Spinner} from 'native-base';
import {LoadingProps} from '../interfaces/loading-props';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const VLoading = ({isDarkModeOn}: LoadingProps) => {
  return (
    <Box
      flex={1}
      justifyContent="center"
      alignItems="center"
      bg={isDarkModeOn ? Colors.darker : Colors.lighter}>
      <Spinner size="lg" color={isDarkModeOn ? Colors.white : Colors.black} />
    </Box>
  );
};

export default VLoading;
