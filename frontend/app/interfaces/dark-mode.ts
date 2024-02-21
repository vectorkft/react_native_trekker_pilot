export interface DarkMode {
    isDarkMode: boolean;
    toggleDarkMode: () => Promise<void>;
}