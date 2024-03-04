import {useContext} from 'react';
import {DarkModeContext} from '../providers/dark-mode';

export const DarkModeService = {
  useDarkMode: () => {
    const context = useContext(DarkModeContext);

    if (!context) {
      throw new Error('DarkModeContext is undefined');
    }

    const {isDarkMode, toggleDarkMode} = context;

    return {isDarkMode, toggleDarkMode};
  },
};
