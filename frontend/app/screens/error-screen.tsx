import React, {useContext} from 'react';
import {ErrorBoundaryProps} from '../interfaces/error-boundary';
import {
  RESPONSE_BAD_GATEWAY,
  RESPONSE_INTERNAL_SERVER_ERROR,
} from '../constants/response-status';
import {Text, View, Modal} from 'react-native';
import {LoadingContext} from '../providers/loading';
import VButton from '../components/Vbutton';
import {Color} from '../enums/color';
import {errorScreen} from '../styles/error-screen';
import {DarkModeContext} from '../providers/dark-mode';

export const ErrorScreen = ({errorCode, onClick}: ErrorBoundaryProps) => {
  const FONT_SIZE = 16;
  const HEIGHT = 40;
  const BORDER_RADIUS = 10;
  const {setLoadingState} = useContext(LoadingContext);
  const {isDarkMode} = useContext(DarkModeContext);
  const [isVisible, setIsVisible] = React.useState(true);

  const handleOnClose = () => {
    setIsVisible(false);
    onClick();
    setLoadingState(false);
  };

  let errorMessage: string;

  switch (errorCode) {
    case RESPONSE_INTERNAL_SERVER_ERROR:
      errorMessage = 'Sikertelen művelet, az adatbázis szerver nem elérhető.';
      break;
    case RESPONSE_BAD_GATEWAY:
      errorMessage = 'Sikertelen művelet, a szerver nem elérhető!.';
      break;
    default:
      errorMessage = 'Ismeretlen hiba történt.';
  }

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleOnClose}>
      <View style={errorScreen(isDarkMode).centeredView}>
        <View style={errorScreen(isDarkMode).modalView}>
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
    </Modal>
  );
};
