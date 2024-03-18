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
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://1d625a315d5be4692039604f037797f9@o4506777853493248.ingest.us.sentry.io/4506777855655936',
});

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
            <Stack.Screen name="products" component={Product} />
          </Stack.Navigator>
        </NavigationContainer>
      </LoadingProvider>
    </DarkModeProvider>
  );
};

export default App;
