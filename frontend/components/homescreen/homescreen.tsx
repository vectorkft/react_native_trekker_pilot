import React, {ReactNode, useContext, useEffect} from 'react';
import {View, Button, StyleSheet, Text, Switch, Alert} from 'react-native';
import { DarkModeContext } from "../darkmode/darkmode";
import { NavigationProp } from '@react-navigation/native';
import {useStore} from "../../states/state";
import {useLoginService} from "../../services/login.service";
import {profileService} from "../../services/profile.service";

interface HomeScreenProps {
    navigation: NavigationProp<any>;
    children?: ReactNode;
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
    const isLoggedIn = useStore(state => state.isLoggedIn);
    useStore(state => state.setIsLoggedIn);
    const loginService = useLoginService();
    const useProfileService = profileService();


    const context = useContext(DarkModeContext);

    if (!context) {
        throw new Error("DarkModeContext is undefined");
    }

    const { isDarkMode, toggleDarkMode } = context;

    useEffect(() => {
        navigation.setParams({ isDarkMode });
    }, [isDarkMode]);

    const handleLogout = async () => {
        await loginService.handleLogout();
        Alert.alert("Sikeres kijelentkezés!");
    }

    return (
        <View style={isDarkMode ? styles.darkContainer : styles.lightContainer}>
            {isLoggedIn ? (
                <View>
                <Button title="Profil" onPress={() => {
                    useProfileService.checkToken();
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

const styles = StyleSheet.create({
    lightContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    darkContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    lightTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    darkTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    switchMode: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    lightModeText: {
        fontSize: 16, // Kisebb méretű szöveg
        fontWeight: 'bold',
        color: '#000',
    },
    darkModeText: {
        fontSize: 16, // Kisebb méretű szöveg
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

export default HomeScreen;
