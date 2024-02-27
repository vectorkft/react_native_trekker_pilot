// darkModeService.js
import { useContext } from 'react';
import { DarkModeContext } from "../components/darkmode/dark-mode";

export const DarkModeService = {
    useDarkMode : () => {
        const context = useContext(DarkModeContext);

        if (!context) {
            throw new Error("DarkModeContext is undefined");
        }

        const { isDarkMode, toggleDarkMode } = context;

        return { isDarkMode, toggleDarkMode };
    }
}

