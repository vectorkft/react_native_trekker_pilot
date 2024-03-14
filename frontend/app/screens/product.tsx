import React, {JSX} from 'react';
import {View} from 'react-native';
import {ProductsService} from '../services/products.service';
import {articleStyles} from '../styles/products.stylesheet';
import {
    validateZDTOForm,
} from '../../../shared/services/zod-dto.service';
import VCardNotFound from '../components/VCardNotFound';
import {DarkModeProviderService} from '../services/context-providers.service';
import VCamera from '../components/VCamera';
import VCameraIconButton from '../components/VCamera-icon-button';
import VInput from '../components/VInput';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import VAlert from '../components/VAlert';
import {useInputChange, useOnChangeHandler} from '../states/use-product-states';
import VBackButton from '../components/VBackButton';
import {RouterProps} from '../interfaces/navigation-props';
import {
  ProductEANSchemaInput,
  ProductNumberSchemaInput,
} from '../../../shared/dto/product.dto';
import {useStore} from '../states/zustand-states';
import VInternetToast from '../components/VInternetToast';
import VToast from '../components/VToast';
import VDataTable from '../components/VDataTable';
import VCardSuccess from '../components/VCardSucces';
import {
  useBeepSound,
  useCamera,
  useOnBarCodeRead,
} from '../states/use-camera-states';
import {Icon} from 'react-native-elements';
import {ZodError, ZodIssueCode} from "zod";
import {ValidateForm} from "../interfaces/validate-form";

const Product = ({navigation}: RouterProps): JSX.Element => {
  const {isDarkMode} = DarkModeProviderService.useDarkMode();
  const isConnected = useStore(state => state.isConnected);
  const wasDisconnected = useStore(state => state.wasDisconnected);
  const [searchQuery, setSearchQuery] = React.useState('');
  const beep = useBeepSound();
  const getProductByEAN = async (value: string) => {
    return await ProductsService.getProductByEAN({eankod: value});
  };

  const getProductByNumber = async (value: string) => {
    return await ProductsService.getProductByNumber({cikkszam: value});
  };

    const validateFormArray = async (value: string): Promise<ValidateForm> => {
        const eanValidation = await validateZDTOForm(ProductEANSchemaInput, { eankod: value });
        if (eanValidation.isValid) {
            return { ...eanValidation, validType: 'ean' };
        } else {
            const numberValidation = await validateZDTOForm(ProductNumberSchemaInput, { cikkszam: value });
            if (numberValidation.isValid) {
                return { ...numberValidation, validType: 'number' };
            }
        }
        return { isValid: false, error: new ZodError([{
                code: ZodIssueCode.custom,
                message: "Nem megfelelő adat!",
                path: [],
            }]), validType: null };
    };

  const [
    errorMessage,
    searchQueryState,
    changeHandlerResult,
    onChangeHandler,
    setErrorMessage,
  ] = useOnChangeHandler(
    validateFormArray,
    getProductByEAN,
    getProductByNumber,
    setSearchQuery,
  );
  const {onChangeInput, onChangeInputWhenEnabled, inputRef} = useInputChange(
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
      <View style={{marginLeft: '15%', width: '65%'}}>
        <VInput
          inputProps={{
            ref: inputRef,
            value: searchQuery,
            showSoftInputOnFocus: true,
            autoFocus: !searchQuery,
            onChangeText: onChangeInputWhenEnabled,
            placeholder: 'Keresés...',
            keyboardType: 'numeric',
            rightIcon: (
              <Icon
                type="antdesign"
                name="search1"
                size={25}
                color={isDarkMode ? '#ffffff' : '#000000'}
                disabled={!searchQuery || !isConnected}
                disabledStyle={{backgroundColor: 'transparent'}}
                onPress={() => {
                  onChangeHandler(searchQuery);
                }}
              />
            ),
          }}
        />
      </View>
      <View style={{marginLeft: '80%', marginTop: -60}}>
        {scanned && <VCameraIconButton onPress={clickCamera} />}
      </View>
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
