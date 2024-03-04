import {useContext} from 'react';
import {LoadingContext} from '../providers/loading';

export const LoadingService = {
  useLoading: () => {
    const context = useContext(LoadingContext);
    if (!context) {
      throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
  },
};
