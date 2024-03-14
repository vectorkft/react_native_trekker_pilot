import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import {DarkModeProviderService, LoadingProviderService} from "../services/context-providers.service";
import { RouterProps } from "../interfaces/navigation-props";
import { useStore } from "../states/zustand-states";
import VBackButton from "../components/VBackButton";
import {RouteProp, useRoute} from "@react-navigation/native";
import {StackParamList} from "../interfaces/stack-param-list";
import {LoginService} from "../services/login.service";
import LoadingScreen from "./loading-screen";
import {useAlert} from "../states/use-alert";
import VAlert from "../components/VAlert";

const Header = ({ navigation}: RouterProps) => {
    const { isDarkMode } = DarkModeProviderService.useDarkMode();
    const { isConnected, setIsLoggedIn } = useStore.getState();
    const {loading, setLoadingState} = LoadingProviderService.useLoading();
    const {errorMessage, setErrorMessage} = useAlert();
    const routeHomeScreen = useRoute<RouteProp<StackParamList, 'homescreen'>>();
    const routeProfile = useRoute<RouteProp<StackParamList, 'profile'>>();
    const hidebutton  = routeHomeScreen.params.hidebutton || routeProfile.params.hidebutton;
    const hideButtonProfile  = routeProfile.params.hideButtonProfile;

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <View style={[styles.header, { backgroundColor: isDarkMode ? '#2d2d2d' : '#d2cfcf' }]}>
            {errorMessage && (
                <VAlert type="error" title={'Hiba!'} message={errorMessage} />
            )}
            <View style={styles.iconContainer}>
                {!hideButtonProfile && <TouchableOpacity
                    style={styles.iconButton}
                    disabled={!isConnected}
                    onPress={() => navigation.navigate('profile',{hidebutton: false,hideButtonProfile: true})}>
                    <Icon
                        name='user'
                        type='font-awesome'
                        color={isDarkMode ? '#fff' : '#000'}
                        size={35}
                    />
                </TouchableOpacity>}
                {!hidebutton &&
                    <TouchableOpacity
                    style={styles.iconButton}
                    disabled={!isConnected}
                    onPress={async () => {
                        setLoadingState(true);
                        const logoutSuccess = await LoginService.handleLogout();
                        if (logoutSuccess) {
                            setIsLoggedIn(false);
                            setLoadingState(false);
                            navigation.navigate('login');
                            return 'Sikeres kijelentkezés!';
                        }else {
                            setLoadingState(false);
                            setErrorMessage('Sikertelen kijelentkezés');
                        }
                    }}>
                    <Icon
                        name='exit-to-app'
                        type='material'
                        color={isDarkMode ? '#fff' : '#000'}
                        size={35}
                    />
                </TouchableOpacity>}
            </View>
            {!hidebutton && <VBackButton navigation={navigation} />}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#00EDAE',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
    },
    iconButton: {
        marginHorizontal: 8,
    },
});

export default Header;
