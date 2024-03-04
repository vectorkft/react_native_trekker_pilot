import React, {JSX} from 'react';
import {View, TextInput, Alert, Keyboard} from 'react-native';
import {ProductsService} from '../services/products.service';
import {articleStyles} from '../styles/products.stylesheet';
import {parseResponseMessages} from '../../../shared/services/zod-dto.service';
import {ZArticleDTOOutput2} from '../../../shared/dto/article.dto';
// import {BarCodeScanner} from 'expo-barcode-scanner';
import CardComponentNotFound from '../components/card-component-not-found';
import Vbutton from '../components/Vbutton';
import DataTable from '../components//data-table';
import {DarkModeService} from '../services/dark-mode.service';
import CardComponentSuccess from '../components/card-component';
import {Colors} from "react-native/Libraries/NewAppScreen";

const Product = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchQueryState, setSearchQueryState] = React.useState(0);
  const [_value, setValue] = React.useState(0);
  const timeout = React.useRef(0);
  const [result, setResult] = React.useState<
    ZArticleDTOOutput2 | false | Response
  >();
  const {isDarkMode} = DarkModeService.useDarkMode();

  // const [scanned, setScanned] = useState(true);
  // // const [text, setText] = useState('Not yet scanned');
  // // const [hasPermission, setHasPermission] = useState(null);
  // const [isCameraActive, setIsCameraActive] = useState(false);

  // useEffect(() => {
  //   const getBarCodeScannerPermissions = async () => {
  //     const {status} = await BarCodeScanner.requestPermissionsAsync();
  //     setHasPermission(status === 'granted');
  //   };
  //
  //   getBarCodeScannerPermissions().catch(error => console.log(error));
  // }, []);

  // const handleBarCodeScanned = ({type, data}) => {
  //   setScanned(true);
  //   onChangeHandler(data);
  //   setIsCameraActive(false);
  // };

  // if (hasPermission === null) {
  //   return <Text>Requesting for camera permission</Text>;
  // }
  // if (hasPermission === false) {
  //   return <Text>No access to camera</Text>;
  // }

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

  return (
    <View style={articleStyles.container}>
      {/*<FontAwesome name="rocket" size={30} color="#900" />*/}
      {/*{isCameraActive && (*/}
      {/*  <View style={camera.container}>*/}
      {/*    <BarCodeScanner*/}
      {/*      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}*/}
      {/*      style={StyleSheet.absoluteFillObject}*/}
      {/*    />*/}
      {/*    <View style={{position: 'absolute', top: 0, right: 0, padding: 20}}>*/}
      {/*      <Ionicons*/}
      {/*        name="md-close"*/}
      {/*        size={50}*/}
      {/*        color="white"*/}
      {/*        onPress={() => {*/}
      {/*          setIsCameraActive(false);*/}
      {/*          setScanned(true);*/}
      {/*        }}*/}
      {/*      />*/}
      {/*    </View>*/}
      {/*  </View>*/}
      {/*)}*/}
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
      {/*{scanned && (*/}
      {/*  <Vbutton*/}
      {/*    label={'Camera'}*/}
      {/*    enabled={true}*/}
      {/*    onClick={() => {*/}
      {/*      setScanned(false);*/}
      {/*      setIsCameraActive(true);*/}
      {/*    }}*/}
      {/*  />*/}
      {/*)}*/}
      <Vbutton
          buttonProps={{
            title: 'Keresés',
            onPress: () => onChangeHandler,
            color: isDarkMode ? Colors.black : Colors.white
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
