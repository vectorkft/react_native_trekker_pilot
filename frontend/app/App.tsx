import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/home-screen';
import Login from './screens/login';
import {DarkModeProvider} from './providers/dark-mode';
import Profile from './screens/profile';
import Product from './screens/product';
import {LoadingProvider} from './providers/loading';
import {StackParamList} from './interfaces/stack-param-list';
import {navigationRef} from './services/navigation.service';

const Stack = createStackNavigator<StackParamList>();

const App = () => {
  return (
    <DarkModeProvider>
      <LoadingProvider>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            screenOptions={{
              animationEnabled: false,
              headerShown: false,
            }}
            initialRouteName="login">
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="homescreen" component={HomeScreen} />
            <Stack.Screen name="profile" component={Profile} />
            <Stack.Screen name="articles" component={Product} />
          </Stack.Navigator>
        </NavigationContainer>
      </LoadingProvider>
    </DarkModeProvider>
  );
};

export default App;
