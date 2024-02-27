import React, {JSX, useEffect, useState} from 'react';
import {View, Text, Switch, Alert, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useStore} from "../../states/states";
import {profileService} from "../../services/profile.service";
import {RouterProps} from "../../interfaces/navigation-props";
import {LoginService} from "../../services/login.service";
import {styles} from "../../styles/components.stylesheet";
import {ProfileData} from "../../interfaces/profile-data";
import {DarkModeService} from "../../services/dark-mode.service";
import ButtonComponent from "../../components/button/button-component";

const Profile = ({ navigation }: RouterProps): JSX.Element => {
    const { setIsLoggedIn, isLoggedIn } = useStore.getState();
    const [profileData, setProfileData] = useState<ProfileData|Response>();
    const [loading, setLoading] = useState(true);

    const { isDarkMode, toggleDarkMode } = DarkModeService.useDarkMode();

    useEffect(() => {
        navigation.setParams({ isDarkMode });
    }, [isDarkMode]);

    useEffect(() => {
        let cancelled = false;

        profileService.handleUserProfileRequest().then(profile => {
            if (!cancelled) {
                setProfileData(profile);
                setLoading(false);
            }
        })
            .catch(console.error);

        return () => {
            cancelled = true;
        };
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
                    {profileData && 'username' in profileData && (
                        <Text style={isDarkMode ? styles.darkTitle : styles.lightTitle}>
                            Üdvözöllek a profilon {profileData.username}!</Text>
                    )}
                    <ButtonComponent
                        label="Kijelentkezés"
                        enabled={isDarkMode}
                        onClick={handleLogout}
                    />
                    <ButtonComponent
                        label="Cikkek"
                        enabled={isDarkMode}
                        onClick={() => navigation.navigate('articles')}
                    />
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
        </View>
    );
};

export default Profile;
