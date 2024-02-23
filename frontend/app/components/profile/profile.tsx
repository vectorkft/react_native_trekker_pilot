import React, {JSX, useContext, useEffect, useState} from 'react';
import {View, Text, Switch, Alert, TouchableOpacity, ActivityIndicator} from 'react-native';
import { DarkModeContext } from "../darkmode/dark-mode";
import {useStore} from "../../states/states";
import {profileService} from "../../services/profile.service";
import {RouterProps} from "../../interfaces/navigation-props";
import {LoginService} from "../../services/login.service";
import {styles} from "../../styles/components.stylesheet";

const Profile = ({ navigation }: RouterProps): JSX.Element => {
    const context = useContext(DarkModeContext);
    const { setIsLoggedIn, isLoggedIn } = useStore.getState();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    if (!context) {
        throw new Error("DarkModeContext is undefined");
    }

    const { isDarkMode, toggleDarkMode } = context;

    useEffect(() => {
        navigation.setParams({ isDarkMode });
    }, [isDarkMode]);

    useEffect(() => {
        profileService.handleUserProfileRequest().then(profile => {
            setProfileData(profile);
            setLoading(false);
        })
            .catch(console.error);
    }, [setProfileData]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    const handleLogout = async () => {
        const logoutSuccess = await LoginService.handleLogout();
        if (logoutSuccess) {
            setIsLoggedIn(false);
            Alert.alert("Sikeres kijelentkezés!");
            navigation.navigate('homescreen');
        }
    };

    return (
        <View style={isDarkMode ? styles.darkContainer : styles.lightContainer}>
            {isLoggedIn && (
                <View style={{alignItems: 'center'}}>
                    <Text style={isDarkMode ? styles.darkTitle : styles.lightTitle}> Bevagy jelentkezve juhu!</Text>
                    <TouchableOpacity
                        onPress={handleLogout}
                        style={{backgroundColor: '#841584', width: '100%', padding: 10, alignItems: 'center'}}
                    >
                        <Text style={{color: 'white'}}>Kijelentkezés</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('articles')}
                        style={{backgroundColor: '#841584', width: '100%', padding: 10, alignItems: 'center'}}
                    >
                        <Text style={{color: 'white'}}>Cikkek</Text>
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

export default Profile;
