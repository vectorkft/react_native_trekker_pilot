import React, {JSX, useContext} from 'react';
import {View} from 'react-native';
import {useStore} from '../states/zustand';
import {AppNavigation} from '../interfaces/navigation';
import {darkModeContent} from '../styles/dark-mode-content';
import LoadingScreen from './loading-screen';
import VToast from '../components/Vtoast';
import VInternetToast from '../components/Vinternet-toast';
import Header from './header';
import VTile from '../components/Vtile';
import {DarkModeContext} from '../providers/dark-mode';
import {LoadingContext} from '../providers/loading';

const HomeScreen = ({navigation}: AppNavigation): JSX.Element => {
  const isLoggedIn = useStore(state => state.isLoggedIn);
  const isConnected = useStore(state => state.isConnected);
  const wasDisconnected = useStore(state => state.wasDisconnected);
  const {setWasDisconnected} = useStore.getState();
  const {isDarkMode} = useContext(DarkModeContext);
  const {loading} = useContext(LoadingContext);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View
      style={
        isDarkMode
          ? {...darkModeContent.darkContainer, alignItems: 'center'}
          : {...darkModeContent.lightContainer, alignItems: 'center'}
      }>
      <Header navigation={navigation} />
      <VInternetToast isVisible={!isConnected} />
      <VToast
        isVisible={wasDisconnected && isConnected}
        label={'Sikeres kapcsolat!'}
        type={'check'}
        handleEvent={() => setWasDisconnected(false)}
      />
      <View style={{flex: 1, justifyContent: 'center'}}>
        {isLoggedIn && (
          <View>
            <View>
              <VTile
                title={'Cikkek'}
                tileProps={{
                  onPress: () =>
                    navigation.navigate('products', {styleButton: true}),
                  disabled: !isConnected,
                }}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;
