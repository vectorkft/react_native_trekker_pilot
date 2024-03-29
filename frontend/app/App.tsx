import React from 'react';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/homescreen/home-screen';
import Login from "./screens/login/login";
import { DarkModeProvider } from './providers/darkmode/dark-mode';
import Profile from "./screens/profile/profile";
import Product from "./screens/products/product";

type StackParamList = {
    homescreen: undefined;
    profile: undefined;
    articles: undefined;
    login: { hideBackButton?: boolean };
};

const Stack = createStackNavigator<StackParamList>();

export const navigationRef = React.createRef<NavigationContainerRef>();

const App = () => {
    return (
        <DarkModeProvider>
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator>
                    <Stack.Screen
                        name="homescreen"
                        component={HomeScreen}
                        options={{
                            title: 'Főoldal',
                            headerStyle: {
                                backgroundColor: '#fff', // Fekete háttér
                            },
                            headerTitleStyle: {
                                color: '#000', // Fehér címszín
                            },
                        }}
                    />
                    <Stack.Screen
                        name="login"
                        component={Login}
                        options={({ route }) => ({
                            title: 'Bejelentkezés',
                            headerStyle: {
                                backgroundColor: '#fff', // Fekete háttér
                            },
                            headerTitleStyle: {
                                color: '#000', // Fehér címszín
                            },
                            headerLeft: route.params?.hideBackButton ? () => null : undefined,
                        })} />
                    <Stack.Screen
                        name="profile"
                        component={Profile}
                        options={{
                            title: 'Profil',
                            headerStyle: {
                                backgroundColor: '#fff', // Fekete háttér
                            },
                            headerTitleStyle: {
                                color: '#000', // Fehér címszín
                            },
                        }}
                    />
                    <Stack.Screen
                        name="articles"
                        component={Product}
                        options={{
                            title: 'Cikkek',
                            headerStyle: {
                                backgroundColor: '#fff', // Fekete háttér
                            },
                            headerTitleStyle: {
                                color: '#000', // Fehér címszín
                            },
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </DarkModeProvider>
    );
};

export default App;
