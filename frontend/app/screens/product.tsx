import React, {JSX} from 'react';
import {View} from 'react-native';
import {ProductsService} from '../services/products.service';
import {articleStyles} from '../styles/products.stylesheet';
import {
  parseZodError,
  validateZDTOForm,
} from '../../../shared/services/zod-dto.service';
import CardComponentNotFound from '../components/card-component-not-found';
import VButton from '../components/VButton';
import DataTable from '../components//data-table';
import {DarkModeService} from '../services/dark-mode.service';
import CardComponentSuccess from '../components/card-component';
import VCamera from '../components/VCamera';
import VCameraIconButton from '../components/VCamera-icon-button';
import VInput from '../components/VInput';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {ZodError} from 'zod';
import VAlert from '../components/VAlert';
import {
  useBeepSound,
  useCamera,
  useInputChange,
  useOnBarCodeRead,
  useOnChangeHandler,
} from '../states/use-camera-states';
import VBackButton from '../components/VBackButton';
import {RouterProps} from '../interfaces/navigation-props';
import {cikkEANSchemaInput} from '../../../shared/dto/article.dto';

const Product = ({navigation}: RouterProps): JSX.Element => {
  const {isDarkMode} = DarkModeService.useDarkMode();
  const beep = useBeepSound();

  const validateForm = async (value: number) => {
    const {isValid, error} = (await validateZDTOForm(cikkEANSchemaInput, {
      eankod: value,
    })) as {isValid: boolean; error: ZodError};
    return {isValid, error};
  };

  const getArticlesByEAN = async (value: number) => {
    return await ProductsService.getArticlesByEAN({eankod: value});
  };

  const [
    errorMessage,
    searchQueryState,
    changeHandlerResult,
    onChangeHandler,
    setErrorMessage,
  ] = useOnChangeHandler(validateForm, parseZodError, getArticlesByEAN);
  const {onChangeInput, onChangeInputWhenEnabled, searchQuery, setSearchQuery} =
    useInputChange(onChangeHandler);
  const {
    isCameraActive,
    scanned,
    handleOnClose,
    clickCamera,
    setScanned,
    setIsCameraActive,
  } = useCamera(setErrorMessage);
  const onBarCodeRead = useOnBarCodeRead(
    onChangeHandler,
    scanned,
    setScanned,
    setIsCameraActive,
    beep,
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
      <View style={{marginTop: '15%', width: '90%'}}>
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
          disabled: !searchQuery,
          onPress: () => {
            onChangeHandler(Number(searchQuery));
            setSearchQuery('');
          },
        }}
      />
      {changeHandlerResult && 'cikkszam' in changeHandlerResult && (
        <View>
          <CardComponentSuccess
            title={'Találatok'}
            content={changeHandlerResult}
          />
          <DataTable data={changeHandlerResult} />
        </View>
      )}
      {changeHandlerResult === false && (
        <View>
          <CardComponentNotFound title={'Not Found'} ean={searchQueryState} />
        </View>
      )}
      <VBackButton navigation={navigation} />
    </View>
  );
};

export default Product;
