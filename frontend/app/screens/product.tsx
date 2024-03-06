import React, {JSX} from 'react';
import {View, TextInput, Alert, Keyboard} from 'react-native';
import {ProductsService} from '../services/products.service';
import {articleStyles} from '../styles/products.stylesheet';
import {parseResponseMessages} from '../../../shared/services/zod-dto.service';
import {ZArticleDTOOutput2} from '../../../shared/dto/article.dto';
import CardComponentNotFound from '../components/card-component-not-found';
import VButton from '../components/VButton';
import DataTable from '../components//data-table';
import {DarkModeService} from '../services/dark-mode.service';
import CardComponentSuccess from '../components/card-component';

import Sound from 'react-native-sound';
import VCamera from '../components/VCamera';

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

  let beep = new Sound('scanner_beep.mp3', Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log('Hiba történt a hangfájl betöltésekor', error);
      return;
    }
  });

  const onBarCodeRead = (scanResult: any) => {
    if (scanResult.data != null) {
      if (!scanned) {
        onChangeHandler(scanResult.data);
        setScanned(true);
        setIsCameraActive(false);
        beep.play(success => {
          if (!success) {
            console.log('A hang nem játszódott le');
          }
        });
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
  const handleOnClose = () => {
    setIsCameraActive(false);
    setScanned(true);
  };
  if (isCameraActive) {
    return (
      <VCamera
        onScan={onBarCodeRead}
        isCameraActive={isCameraActive}
        onClose={handleOnClose}
      />
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
        // onFocus={() => Keyboard.dismiss()}
      />
      {scanned && (
        <VButton
          buttonPropsNativeElement={{
            title: 'Camera',
            titleStyle: {
              fontFamily: 'Roboto',
              fontSize: 20,
              fontWeight: '700',
              color: isDarkMode ? '#fff' : '#000',
              textAlign: 'center',
            },
            buttonStyle: {
              backgroundColor: '#00EDAE',
              height: 50,
              marginTop: 15,
              marginBottom: 15,
              borderRadius: 10,
              width: '60%',
              marginLeft: 'auto',
              marginRight: 'auto',
            },
            onPress: () => {
              setScanned(false);
              setIsCameraActive(true);
            },
          }}
        />
      )}
      <VButton
        buttonPropsNativeElement={{
          title: 'Keresés',
          titleStyle: {
            fontFamily: 'Roboto',
            fontSize: 20,
            fontWeight: '700',
            color: isDarkMode ? '#fff' : '#000',
            textAlign: 'center',
          },
          buttonStyle: {
            backgroundColor: '#00EDAE',
            height: 50,
            marginTop: 5,
            borderRadius: 10,
            width: '60%',
            marginLeft: 'auto',
            marginRight: 'auto',
          },
          onPress: () => onChangeHandler,
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
