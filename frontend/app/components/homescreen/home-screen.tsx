import React, {JSX, useContext, useEffect} from 'react';
import {View, Button, Text, Switch, Alert} from 'react-native';
import { DarkModeContext } from "../darkmode/dark-mode";
import {useStore} from "../../states/states";
import {LoginService} from "../../services/login.service";
import {RouterProps} from "../../interfaces/navigation-props";
import {styles} from "../../styles/components.stylesheet";

const HomeScreen = ({ navigation }: RouterProps): JSX.Element => {
    const isLoggedIn = useStore(state => state.isLoggedIn);
    const { setIsLoggedIn } = useStore.getState();
    const context = useContext(DarkModeContext);

    if (!context) {
        throw new Error("DarkModeContext is undefined");
    }

    const { isDarkMode, toggleDarkMode } = context;

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
