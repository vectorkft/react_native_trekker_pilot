import React from 'react';
import {ButtonProps} from "../../interfaces/button-props";
import {Text, TouchableOpacity} from "react-native";
import {styles} from "../../styles/components.stylesheet";
import {DarkModeService} from "../../services/dark-mode.service";

const ButtonComponent: React.FC<ButtonProps> = ({ label, enabled, onClick}: ButtonProps) => {
    const { isDarkMode} = DarkModeService.useDarkMode();

    return (
        <TouchableOpacity
            onPress={onClick}
            disabled={!enabled}
            style={{
                backgroundColor: enabled ? 'green' : 'gray',
                padding: 10,
                alignItems: 'center',
                borderRadius: 5, // Lekerekített sarkok
                justifyContent: 'center', // Középre igazítás
                height: 45, // Magasság beállítása
                width: '80%', // Szélesség beállítása
                alignSelf: 'center', // Középre igazítás a szülő elemen belül
            }}
        >
            <Text style={isDarkMode ? styles.darkModeText : styles.lightModeText}>{label}</Text>
        </TouchableOpacity>
    );
};

export default ButtonComponent;
