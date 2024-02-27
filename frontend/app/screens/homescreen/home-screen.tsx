import React, {JSX, useEffect} from 'react';
import {View, Button, Text, Switch, Alert} from 'react-native';
import { useStore } from "../../states/states";
import { LoginService } from "../../services/login.service";
import { DarkModeService } from "../../services/dark-mode.service";
import { RouterProps } from "../../interfaces/navigation-props";
import { styles } from "../../styles/components.stylesheet";
import ButtonComponent from "../../components/button/button-component";

const HomeScreen = ({ navigation }: RouterProps): JSX.Element => {
    const isLoggedIn = useStore(state => state.isLoggedIn);
    const { setIsLoggedIn } = useStore.getState();
    const { isDarkMode, toggleDarkMode } = DarkModeService.useDarkMode();

    useEffect(() => {
        navigation.setParams({ isDarkMode });
    }, [isDarkMode]);

    const handleLogout = async () => {
        const logoutSuccess = await LoginService.handleLogout();
        if (logoutSuccess) {
            setIsLoggedIn(false);
            Alert.alert("Sikeres kijelentkezés!");
        }
    }

    return (
        <View style={isDarkMode ? styles.darkContainer : styles.lightContainer}>
            {isLoggedIn ? (
                <View>
                    <ButtonComponent
                        label="Profil"
                        enabled={isDarkMode}
                        onClick={() => navigation.navigate('profile')}
                    />
                    <ButtonComponent
                        label="Kijelentkezés"
                        enabled={isDarkMode}
                        onClick={handleLogout}
                    />
                </View>
            ) : (
                <ButtonComponent
                    label="Bejelentkezés"
                    enabled={isDarkMode}
                    onClick={() => navigation.navigate('login')}
                />
            )}
            <Text style={isDarkMode ? styles.darkTitle : styles.lightTitle}>Ez a főoldal</Text>
            <View style={styles.switchMode}>
                <Text style={isDarkMode ? styles.darkModeText : styles.lightModeText}>Sötét mód</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
                    onValueChange={toggleDarkMode}
                    value={isDarkMode}
                />
            </View>
        </View>
    );
};

export default HomeScreen;
