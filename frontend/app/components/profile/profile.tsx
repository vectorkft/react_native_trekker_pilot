import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, Switch, Alert, TouchableOpacity, ActivityIndicator} from 'react-native';
import { DarkModeContext } from "../darkmode/dark-mode";
import { useLoginService } from "../../services/login.service";
import {useStore} from "../../states/states";
import {profileService} from "../../services/profile.service";
import {RouterProps} from "../../interfaces/navigation-props";

const Profile = ({ navigation }: RouterProps) => {
    const context = useContext(DarkModeContext);
    const { isLoggedIn } = useStore.getState();
    const loginService = useLoginService();
    const profileS = profileService();
    const [profileData, setProfileData] = useState(null);

    if (!context) {
        throw new Error("DarkModeContext is undefined");
    }

    const { isDarkMode, toggleDarkMode } = context;

    useEffect(() => {
        navigation.setParams({ isDarkMode });
    }, [isDarkMode]);

    useEffect(() => {
        profileS.handleUserProfileRequest().then(profile => {
            setProfileData(profile);
        })
            .catch(console.error);
    }, [setProfileData]);

    if (!profileData) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    const handleLogoutClick = async () => {
        await loginService.handleLogout();
        Alert.alert('Sikeres kijelentkezés!');
        navigation.navigate('homescreen');
    };

    return (
        <View style={isDarkMode ? styles.darkContainer : styles.lightContainer}>
            {isLoggedIn && (
                <View style={{alignItems: 'center'}}>
                    <Text style={isDarkMode ? styles.darkTitle : styles.lightTitle}> Bevagy jelentkezve juhu!</Text>
                    <TouchableOpacity
                        onPress={handleLogoutClick}
                        style={{backgroundColor: '#841584', width: '100%', padding: 10, alignItems: 'center'}}
                    >
                        <Text style={{color: 'white'}}>Kijelentkezés</Text>
                    </TouchableOpacity>
                    {profileData && (
                        <Text style={isDarkMode ? styles.darkTitle : styles.lightTitle}>
                            {JSON.stringify(profileData)}</Text> // profil adatok megjelenítése
                    )}
                </View>
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
            <Text style={isDarkMode ? styles.darkTitle : styles.lightTitle}>Üdvözöllek a profilon!</Text>
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

export default Profile;
