import React from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/home-screen';
import Login from './screens/login';
import {DarkModeProvider} from './providers/dark-mode';
import Profile from './screens/profile';
import Product from './screens/product';
import {PaperProvider} from 'react-native-paper';
import {LoadingProvider} from './providers/loading';
import {StackParamList} from './interfaces/stack-param-list';
import {NativeBaseProvider} from 'native-base';

const Stack = createStackNavigator<StackParamList>();
export const navigationRef = React.createRef<NavigationContainerRef>();

const App = () => {
  return (
    <NativeBaseProvider>
      <DarkModeProvider>
        <LoadingProvider>
          <PaperProvider>
            <NavigationContainer ref={navigationRef}>
              <Stack.Navigator initialRouteName="login">
                <Stack.Screen
                  name="login"
                  component={Login}
                  options={{
                    headerShown: false,
                    animationEnabled: false,
                  }}
                />
                <Stack.Screen
                  name="homescreen"
                  component={HomeScreen}
                  options={{
                    headerShown: false,
                    animationEnabled: false,
                  }}
                />
                <Stack.Screen
                  name="profile"
                  component={Profile}
                  options={{
                    headerShown: false,
                    animationEnabled: false,
                  }}
                />
                <Stack.Screen
                  name="articles"
                  component={Product}
                  options={{
                    headerShown: false,
                    animationEnabled: false,
                  }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </PaperProvider>
        </LoadingProvider>
      </DarkModeProvider>
    </NativeBaseProvider>
  );
};

export default App;
