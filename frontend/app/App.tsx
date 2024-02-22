import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './components/homescreen/home-screen';
import Login from "./components/login/login";
import { DarkModeProvider } from './components/darkmode/dark-mode';
import Profile from "./components/profile/profile";
import Articles from "./components/articles/articles";

const Stack = createStackNavigator();

const App = () => {
    return (
        <DarkModeProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="homescreen">
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
                        options={{
                            title: 'Bejelentkezés',
                            headerStyle: {
                                backgroundColor: '#fff', // Fekete háttér
                            },
                            headerTitleStyle: {
                                color: '#000', // Fehér címszín
                            },
                        }} />
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
                        component={Articles}
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
