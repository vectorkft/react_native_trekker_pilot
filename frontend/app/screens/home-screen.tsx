import React, {JSX, useContext} from 'react';
import {View} from 'react-native';
import {useStore} from '../states/zustand';
import {AppNavigation} from '../interfaces/navigation';
import Header from './header';
import VTile from '../components/Vtile';
import {DarkModeContext} from '../providers/dark-mode';
import {homeScreenStyles} from '../styles/home-screen';
import withNetInfo from '../components/with-net-info';

const HomeScreen = ({navigation}: AppNavigation): JSX.Element => {
  const isLoggedIn = useStore(state => state.isLoggedIn);
  const {isDarkMode} = useContext(DarkModeContext);

  return (
    <View style={homeScreenStyles(isDarkMode).container}>
      <Header navigation={navigation} />
      <View style={homeScreenStyles().innerView}>
        {isLoggedIn && (
          <View>
            <View>
              <VTile
                title={'Cikkek'}
                tileProps={{
                  onPress: () =>
                    navigation.navigate('products', {styleButton: true}),
                }}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default withNetInfo(HomeScreen);
