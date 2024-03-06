import React, {JSX} from 'react';
import {View, TextInput, Alert, Keyboard, StyleSheet} from 'react-native';
import {ProductsService} from '../services/products.service';
import {articleStyles} from '../styles/products.stylesheet';
import {parseResponseMessages} from '../../../shared/services/zod-dto.service';
import {ZArticleDTOOutput2} from '../../../shared/dto/article.dto';
import CardComponentNotFound from '../components/card-component-not-found';
import VButton from '../components/VButton';
import DataTable from '../components//data-table';
import {DarkModeService} from '../services/dark-mode.service';
import CardComponentSuccess from '../components/card-component';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/AntDesign';
import {IconButton} from 'native-base';
import {backButtonStyles} from '../styles/back-button-component.stylesheet';

const Product = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchQueryState, setSearchQueryState] = React.useState(0);
  const [_value, setValue] = React.useState(0);
  const timeout = React.useRef(0);
  const [result, setResult] = React.useState<
    ZArticleDTOOutput2 | false | Response
  >();
  const {isDarkMode} = DarkModeService.useDarkMode();
  const [isCameraActive, setIsCameraActive] = React.useState(false);
  const [scanned, setScanned] = React.useState(true);

  const onBarCodeRead = scanResult => {
    if (scanResult.data != null) {
      if (!scanned) {
        onChangeHandler(scanResult.data);
        setScanned(true);
        setIsCameraActive(false);
      }
    }
    return;
  };

  const onChangeHandler = (value: number) => {
    clearTimeout(timeout.current);
    setValue(value);
    timeout.current = setTimeout(async () => {
      const eanNumber = Number(value);

      if (isNaN(eanNumber)) {
        Alert.alert('Hiba', 'Kérjük, adjon meg egy érvényes számot.');
      } else {
        try {
          const response = await ProductsService.getArticlesByEAN({
            eankod: eanNumber,
          });
          setResult(response);
          setSearchQueryState(value);

          if (response && 'status' in response) {
            const msg = await parseResponseMessages(response);
            Alert.alert('Hiba!', msg);
          }

          Keyboard.dismiss();
        } catch (error: any) {
          console.log('Hiba történt', error);
        }
      }
    }, 100);
  };
  if (isCameraActive) {
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <RNCamera
          onBarCodeRead={isCameraActive ? onBarCodeRead : undefined}
          style={StyleSheet.absoluteFillObject}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          autoFocus={RNCamera.Constants.AutoFocus.on}
          zoom={0}
        />
        <IconButton
          style={backButtonStyles.backButton}
          icon={
            <Icon
              name="close"
              size={30}
              color={isDarkMode ? '#ffffff' : '#000000'}
            />
          }
          onPress={() => {
            setIsCameraActive(false);
            setScanned(true);
          }}
        />
      </View>
    );
  }

  return (
    <View style={articleStyles.container}>
      <TextInput
        style={articleStyles.input}
        onChangeText={(value: any) => {
          onChangeHandler(value);
          setSearchQuery(searchQuery);
        }}
        value={searchQuery}
        placeholder="Keresés..."
        keyboardType="numeric"
        autoFocus
        onFocus={() => Keyboard.dismiss()}
      />
      {scanned && (
        <VButton
          buttonProps={{
            title: 'Camera',
            onPress: () => {
              setScanned(false);
              setIsCameraActive(true);
            },
            color: isDarkMode ? Colors.lighter : Colors.darker,
          }}
        />
      )}
      <VButton
        buttonProps={{
          title: 'Keresés',
          onPress: () => onChangeHandler,
          color: isDarkMode ? Colors.lighter : Colors.darker,
        }}
      />
      {result && 'cikkszam' in result && (
        <View>
          <CardComponentSuccess title={'Találatok'} content={result} />
          <DataTable data={result} />
        </View>
      )}
      {result === false && (
        <View>
          <CardComponentNotFound title={'Not Found'} ean={searchQueryState} />
        </View>
      )}
    </View>
  );
};

export default Product;
