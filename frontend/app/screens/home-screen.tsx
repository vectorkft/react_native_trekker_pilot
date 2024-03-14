import React, {JSX} from 'react';
import {View} from 'react-native';
import {useStore} from '../states/zustand-states';
import {DarkModeProviderService} from '../services/context-providers.service';
import {RouterProps} from '../interfaces/navigation-props';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import {LoadingProviderService} from '../services/context-providers.service';
import LoadingScreen from './loading-screen';
import VToast from '../components/VToast';
import VInternetToast from '../components/VInternetToast';
import Header from "./header";
import VTile from "../components/VTile";

const HomeScreen = ({navigation}: RouterProps): JSX.Element => {
  const isLoggedIn = useStore(state => state.isLoggedIn);
  const isConnected = useStore(state => state.isConnected);
  const wasDisconnected = useStore(state => state.wasDisconnected);
  const {setWasDisconnected} = useStore.getState();
  const {isDarkMode} = DarkModeProviderService.useDarkMode();
  const {loading} = LoadingProviderService.useLoading();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View
      style={
        isDarkMode
          ? {...darkModeContent.darkContainer,alignItems: 'center'}
          : {...darkModeContent.lightContainer,alignItems: 'center'}
      }>
      <Header navigation={navigation}/>
      <VInternetToast isVisible={!isConnected} />
      <VToast
        isVisible={wasDisconnected && isConnected}
        label={'Sikeres kapcsolat!'}
        type={'check'}
        handleEvent={() => setWasDisconnected(false)}
      />
        <View style={{ flex: 1, justifyContent: 'center' }}>
      {isLoggedIn && (
        <View>
          <View>
              <VTile title={"Cikkek"} tileProps={{onPress: () => navigation.navigate('products',{styleButton: true}),disabled: !isConnected}}/>
          </View>
        </View>
      )}
    </View>
    </View>
  );
};

export default HomeScreen;
