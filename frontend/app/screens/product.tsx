import React, {JSX} from 'react';
import {View} from 'react-native';
import {ProductsService} from '../services/products.service';
import {articleStyles} from '../styles/products.stylesheet';
import {parseZodError} from '../../../shared/services/zod-dto.service';
import {ZArticleDTOOutput2} from '../../../shared/dto/article.dto';
import CardComponentNotFound from '../components/card-component-not-found';
import VButton from '../components/VButton';
import DataTable from '../components//data-table';
import {DarkModeService} from '../services/dark-mode.service';
import CardComponentSuccess from '../components/card-component';
import Sound from 'react-native-sound';
import VCamera from '../components/VCamera';
import VCameraIconButton from '../components/VCamera-icon-button';
import VInput from '../components/VInput';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {ZodError} from 'zod';
import {useAlert} from '../states/use-alert';
import VAlert from '../components/VAlert';
import {useCamera, useInputChange} from "../states/use-camera-states";

const Product = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchQueryState, setSearchQueryState] = React.useState(0);
  const [_value, setValue] = React.useState(0);
  const timeout = React.useRef(0);
  const [result, setResult] = React.useState<
    ZArticleDTOOutput2 | false | Response
  >();
  const {isDarkMode} = DarkModeService.useDarkMode();
  const {errorMessage, setErrorMessage} = useAlert();
  const { isCameraActive, scanned, handleOnClose, clickCamera, setScanned, setIsCameraActive } = useCamera();


  const beep = React.useMemo(
    () =>
      new Sound('scanner_beep.mp3', Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log('Hiba történt a hangfájl betöltésekor', error);
        }
      }),
    [],
  );

  const validateForm = async (value: number) => {
    const {isValid, error} = (await ProductsService.validateForm({
      eankod: value,
    })) as {isValid: boolean; error: ZodError};
    return {isValid, error};
  };

  const getArticlesByEAN = async (value: number) => {
    return await ProductsService.getArticlesByEAN({eankod: value});
  };

  const onChangeHandler = React.useCallback(
    (value: number) => {
      clearTimeout(timeout.current);
      setValue(value);
      timeout.current = setTimeout(async () => {
        const eanNumber = Number(value);
        if (isNaN(eanNumber)) {
          setErrorMessage('Kérjük, adjon meg egy érvényes számot.');
          return;
        }

        const {isValid, error} = await validateForm(eanNumber);

        if (!isValid) {
          const msg = await parseZodError(error);
          setErrorMessage(msg);
          return;
        }

        try {
          const response = await getArticlesByEAN(eanNumber);
          setResult(response);
          setSearchQueryState(value);
        } catch (errors: any) {
          console.log('Hiba történt', errors);
        }
      }, 100);
    },
    [validateForm, getArticlesByEAN],
  );

  const { onChangeInput, onChangeInputWhenEnabled } = useInputChange(onChangeHandler, setSearchQuery);

  const onBarCodeRead = React.useCallback(
      (scanResult: any) => {
        if (scanResult.data != null && !scanned) {
          onChangeHandler(scanResult.data);
          setScanned(true);
          setIsCameraActive(false);
          beep.play(success => {
            if (!success) console.log('A hang nem játszódott le');
          });
        }
      },
      [beep, onChangeHandler, scanned],
  );

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
    <View
      style={[
        articleStyles.container,
        {backgroundColor: isDarkMode ? Colors.darker : Colors.lighter},
      ]}>
      {errorMessage && (
        <VAlert type="error" title={'Hibás eankód!'} message={errorMessage} />
      )}
      <View style={{marginTop: '5%', width: '90%'}}>
        <VInput
          inputProps={{
            value: searchQuery,
            showSoftInputOnFocus: true,
            autoFocus: true,
            onChangeText: onChangeInputWhenEnabled,
            placeholder: 'Keresés...',
            keyboardType: 'numeric',
          }}
        />
      </View>
      {scanned && <VCameraIconButton onPress={clickCamera} />}
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
          onPress: () => {
            onChangeHandler(Number(searchQuery));
            setSearchQuery('');
          },
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
