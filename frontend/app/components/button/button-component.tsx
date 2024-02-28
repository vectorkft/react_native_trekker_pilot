import React from 'react';
import {ButtonProps} from "../../interfaces/button-props";
import {Text, TouchableOpacity} from "react-native";
import {styles} from "../../styles/components.stylesheet";
import {DarkModeService} from "../../services/dark-mode.service";
import {buttonStyles} from "../../styles/button-component.stylesheet";

const ButtonComponent: React.FC<ButtonProps> = ({ label, enabled, onClick }: ButtonProps) => {
    const { isDarkMode} = DarkModeService.useDarkMode();

    return (
        <TouchableOpacity
            onPress={onClick}
            disabled={!enabled}
            style={[buttonStyles.button, !enabled && buttonStyles.buttonDisabled]}
        >
            <Text style={isDarkMode ? styles.darkModeText : styles.lightModeText}>{label}</Text>
        </TouchableOpacity>
    );
};

export default ButtonComponent;
