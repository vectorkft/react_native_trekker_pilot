import React, {useContext} from 'react';
import {
  NO_INTERNET_CONNECTION,
  RESPONSE_BAD_GATEWAY,
  RESPONSE_INTERNAL_SERVER_ERROR,
} from '../constants/response-status';
import {Text, View} from 'react-native';
import {LoadingContext} from '../providers/loading';
import VButton from '../components/Vbutton';
import {Color} from '../enums/color';
import {errorScreen} from '../styles/error-screen';
import {DarkModeContext} from '../providers/dark-mode';
import {NavigationService} from '../services/navigation';
import {RouteProp, useRoute} from '@react-navigation/native';
import {UIConfig} from '../types/u-i-config';
import {ErrorContext} from '../providers/error';

export const ErrorScreen = () => {
  const FONT_SIZE = 16;
  const HEIGHT = 40;
  const BORDER_RADIUS = 10;
  const {setLoadingState} = useContext(LoadingContext);
  const {isDarkMode} = useContext(DarkModeContext);
  const routeError = useRoute<RouteProp<UIConfig, 'errorScreen'>>();
  const errorCodeParam = routeError?.params?.errorCodeParam;
  const {setError} = React.useContext(ErrorContext);

  const handleOnClose = () => {
    setError(null, true);
    NavigationService.redirectBack();
    setLoadingState(false);
  };

  let errorMessage: string;

  switch (errorCodeParam) {
    case RESPONSE_INTERNAL_SERVER_ERROR:
      errorMessage = 'Sikertelen művelet, az adatbázis szerver nem elérhető!';
      break;
    case RESPONSE_BAD_GATEWAY:
      errorMessage = 'Sikertelen művelet, a szerver nem elérhető!';
      break;
    case NO_INTERNET_CONNECTION:
      errorMessage =
        'Sikertelen művelet, kérjük ellenőrizze internet kapcsolatát!';
      break;
    default:
      errorMessage = 'Ismeretlen hiba történt!';
  }

  return (
    <View style={errorScreen(isDarkMode).centeredView}>
      <View style={errorScreen(isDarkMode).innerView}>
        <Text style={errorScreen(isDarkMode).title}>Hiba történt</Text>
        <Text style={errorScreen(isDarkMode).text}>{errorMessage}</Text>
        <VButton
          buttonPropsNativeElement={{
            title: 'Bezár',
            titleStyle: {
              fontFamily: 'Roboto',
              fontSize: FONT_SIZE,
              fontWeight: '700',
              color: isDarkMode ? Color.lightContent : Color.darkContent,
            },
            buttonStyle: {
              backgroundColor: Color.primary,
              height: HEIGHT,
              borderRadius: BORDER_RADIUS,
            },
            onPress: handleOnClose,
          }}
        />
      </View>
    </View>
  );
};
