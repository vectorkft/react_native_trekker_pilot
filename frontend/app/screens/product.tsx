import React, {JSX} from 'react';
import {View} from 'react-native';
import {ProductsService} from '../services/products.service';
import {articleStyles} from '../styles/products.stylesheet';
import {
  parseZodError,
  validateZDTOForm,
} from '../../../shared/services/zod-dto.service';
import VCardNotFound from '../components/VCardNotFound';
import VButton from '../components/VButton';
import {DarkModeProviderService} from '../services/context-providers.service';
import VCamera from '../components/VCamera';
import VCameraIconButton from '../components/VCamera-icon-button';
import VInput from '../components/VInput';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {ZodError} from 'zod';
import VAlert from '../components/VAlert';
import {
  useInputChange,
  useOnChangeHandler,
} from '../states/use-products-states';
import VBackButton from '../components/VBackButton';
import {RouterProps} from '../interfaces/navigation-props';
import {cikkEANSchemaInput} from '../../../shared/dto/article.dto';
import {useStore} from '../states/zustand-states';
import VInternetToast from '../components/VInternetToast';
import VToast from '../components/VToast';
import VDataTable from '../components/VDataTable';
import VCardSuccess from '../components/VCardSucces';
import {
  useBeepSound,
  useCamera,
  useOnBarCodeRead,
} from '../states/user-camera-states';

const Product = ({navigation}: RouterProps): JSX.Element => {
  const {isDarkMode} = DarkModeProviderService.useDarkMode();
  const isConnected = useStore(state => state.isConnected);
  const wasDisconnected = useStore(state => state.wasDisconnected);
  const [searchQuery, setSearchQuery] = React.useState('');
  const beep = useBeepSound();

  const getArticlesByEAN = async (value: number) => {
    return await ProductsService.getProductsByEAN({eankod: value});
  };
  const validateForm = async (value: number) => {
    const {isValid, error} = (await validateZDTOForm(cikkEANSchemaInput, {
      eankod: value,
    })) as {isValid: boolean; error: ZodError};
    return {isValid, error};
  };

  const [
    errorMessage,
    searchQueryState,
    changeHandlerResult,
    onChangeHandler,
    setErrorMessage,
  ] = useOnChangeHandler(
    validateForm,
    parseZodError,
    getArticlesByEAN,
    setSearchQuery,
  );
  const {onChangeInput, onChangeInputWhenEnabled} = useInputChange(
    onChangeHandler,
    searchQuery,
    setSearchQuery,
  );
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
      <VInternetToast isVisible={!isConnected} />
      <VToast
        isVisible={wasDisconnected && isConnected}
        label={'Sikeres kapcsolat!'}
        type={'check'}
      />
      {errorMessage && (
        <VAlert type="error" title={'Hibás eankód!'} message={errorMessage} />
      )}
      <View style={{marginTop: '15%', width: '90%'}}>
        <VInput
          inputProps={{
            value: searchQuery,
            showSoftInputOnFocus: false,
            autoFocus: true,
            onChangeText: onChangeInput,
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
            width: '70%',
            marginLeft: 'auto',
            marginRight: 'auto',
          },
          disabled: !searchQuery || !isConnected,
          onPress: () => {
            onChangeHandler(Number(searchQuery));
          },
        }}
      />
      {changeHandlerResult?.status === 200 && (
        <View>
          {/*<VDataTable data={changeHandlerResult} />*/}
          <VCardSuccess title={'Találatok'} content={changeHandlerResult} />
        </View>
      )}
      {changeHandlerResult?.status === 204 && (
        <View>
          <VCardNotFound title={'Not Found'} ean={searchQueryState} />
        </View>
      )}
      <VBackButton navigation={navigation} />
    </View>
  );
};

export default Product;
