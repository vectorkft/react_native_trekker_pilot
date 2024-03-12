import {useContext} from 'react';
import {DarkModeContext} from '../providers/dark-mode';
import {LoadingContext} from '../providers/loading';

export const DarkModeProviderService = {
  useDarkMode: () => {
    const context = useContext(DarkModeContext);

    if (!context) {
      throw new Error('DarkModeContext is undefined');
    }

    const {isDarkMode, toggleDarkMode} = context;

    return {isDarkMode, toggleDarkMode};
  },
};

export const LoadingProviderService = {
  useLoading: () => {
    const context = useContext(LoadingContext);
    if (!context) {
      throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
  },
};
