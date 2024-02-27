import React, {JSX, useEffect} from 'react';
import {View, Button, Text, Switch, Alert} from 'react-native';
import { useStore } from "../../states/states";
import { LoginService } from "../../services/login.service";
import { DarkModeService } from "../../services/dark-mode.service";
import { RouterProps } from "../../interfaces/navigation-props";
import { styles } from "../../styles/components.stylesheet";
import ButtonComponent from "../button/button";

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
                <Button title="Profil" onPress={() => {
                    navigation.navigate('profile');
                }} />
                <Button title="Kijelentkezés" onPress={handleLogout} />
                    <ButtonComponent
                        label="Kattints rám"
                        enabled={true}
                        onClick={() => console.log('A gombra kattintottak!')}
                    />
                </View>
            ) : (
                <Button title="Bejelentkezés" onPress={() => navigation.navigate('login')} />
            )}
            <View style={styles.switchMode}>
                <Text style={isDarkMode ? styles.darkModeText : styles.lightModeText}>Sötét mód</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
                    onValueChange={toggleDarkMode}
                    value={isDarkMode}
                />
            </View>
            <Text style={isDarkMode ? styles.darkTitle : styles.lightTitle}>Ez a főoldal</Text>
        </View>
    );
};

export default HomeScreen;
