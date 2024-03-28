import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/home-screen';
import Login from './screens/login';
import {DarkModeProvider} from './providers/dark-mode';
import Profile from './screens/profile';
import Product from './screens/product';
import {LoadingProvider} from './providers/loading';
import {UIConfig} from './types/u-i-config';
import {navigationRef} from './services/navigation';
import * as Sentry from '@sentry/react-native';
import {ErrorContext, ErrorProvider} from './providers/error';
import {useError} from './states/use-error';

Sentry.init({
  dsn: 'https://1d625a315d5be4692039604f037797f9@o4506777853493248.ingest.us.sentry.io/4506777855655936',
});

const Stack = createStackNavigator<UIConfig>();

const App = () => {
  const {hasError, errorCode, setError} = useError();

  return (
    <DarkModeProvider>
      <LoadingProvider>
        <NavigationContainer ref={navigationRef}>
          <ErrorContext.Provider value={{hasError, errorCode, setError}}>
            <ErrorProvider>
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
            </ErrorProvider>
          </ErrorContext.Provider>
        </NavigationContainer>
      </LoadingProvider>
    </DarkModeProvider>
  );
};

export default App;
