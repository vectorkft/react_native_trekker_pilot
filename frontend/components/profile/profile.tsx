import React, {ReactNode, useContext, useEffect} from 'react';
import {View, StyleSheet, Text, Switch, Alert, TouchableOpacity, Button} from 'react-native';
import { DarkModeContext } from "../darkmode/darkmode";
import { useLoginService } from "../../services/login.service";
import {NavigationProp} from "@react-navigation/native";
import {useStore} from "../../states/state";
import {tokenhandlingService} from "../../services/tokenhandling.service";
import {profileService} from "../../services/profile.service";

interface ProfileScreenProps {
    navigation: NavigationProp<any>;
    children?: ReactNode;
}

const Profile = ({ navigation }: ProfileScreenProps) => {
    const context = useContext(DarkModeContext);
    const isLoggedIn = useStore(state => state.isLoggedIn);
    useStore(state => state.setIsLoggedIn);
    const loginService = useLoginService();
    const tokenService = tokenhandlingService();
    const profile = profileService();

    if (!context) {
        throw new Error("DarkModeContext is undefined");
    }

    const { isDarkMode, toggleDarkMode } = context;

    useEffect(() => {
        navigation.setParams({ isDarkMode });
    }, [isDarkMode]);

    const handleLogoutClick = async () => {
        await loginService.handleLogout();
        Alert.alert('Sikeres kijelentkezés!')
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
                    {/*<Button title={"Get Access Token"} onPress={tokenService.getAccessToken}/>*/}
                    {/*<Button title={"Get Refresh Token"} onPress={tokenService.getRefreshToken}/>*/}
                    {/*<Button title={"Get ID"} onPress={profile.checkId}/>*/}
                    <Button title={"Token frissítés"} onPress={tokenService.isTokenValid}/>
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
