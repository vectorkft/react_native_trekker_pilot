import React, {
  Dispatch,
  JSX,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import {View} from 'react-native';
import {ProductService} from '../services/product';
import {validateZDTOForm} from '../../../shared/services/zod-dto.service';
import VCardNotFound from '../components/Vcard-not-found';
import VCamera from '../components/Vcamera';
import VCameraIconButton from '../components/Vcamera-icon-button';
import VInput from '../components/Vinput';
import VAlert from '../components/Valert';
import {useInputChange, useOnChangeHandler} from '../states/use-product-search';
import VBackButton from '../components/Vback-button';
import {AppNavigation} from '../interfaces/navigation';
import {
  ProductEANSchemaInput,
  ProductNumberSchemaInput,
  ZProductListOutput,
} from '../../../shared/dto/product.dto';
import {useStore} from '../states/zustand';
import VInternetToast from '../components/Vinternet-toast';
import VToast from '../components/Vtoast';
import VDataTable from '../components/Vdata-table';
import {
  useBeepSound,
  useCamera,
  useOnBarCodeRead,
} from '../states/use-camera-scan';
import {Icon} from 'react-native-elements';
import {AnyZodObject, ZodError, ZodIssueCode} from 'zod';
import {ValidationResult} from '../interfaces/validation-result';
import {darkModeContent} from '../styles/dark-mode-content';
import VKeyboardIconButton from '../components/Vkeyboard-icon-button';
import {DarkModeContext} from '../providers/dark-mode';
import {DeviceInfoEnum} from '../../../shared/enums/device-info';
import {TIMEOUT_DELAY} from '../constants/time';
import HamburgerMenu from '../components/Vhamburger-menu';
import {productStyles} from '../styles/product';
import {
  RESPONSE_NO_CONTENT,
  RESPONSE_SUCCESS,
} from '../constants/response-status';
import {AlertTypes, ToastTypes} from '../enums/types';

const Product = ({navigation}: AppNavigation): JSX.Element => {
  const {isDarkMode} = useContext(DarkModeContext);
  const {setWasDisconnected, deviceType} = useStore.getState();
  const isConnected = useStore(state => state.isConnected);
  const wasDisconnected = useStore(state => state.wasDisconnected);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [keyboardActive, setKeyboardActive] = useState(false);
  const {inputRef} = useInputChange(searchQuery);
  const beep = useBeepSound();
  const getProductByEAN = async (value: string) => {
    return await ProductService.getProductByEAN({eankod: value});
  };

  const getProductByNumber = async (value: string) => {
    return await ProductService.getProductByNumber({cikkszam: value});
  };

  type TSchemaDataPair = {
    schema: AnyZodObject;
    formData: {[key: string]: string};
  };

  const validateFormArray = async (
    value: string,
  ): Promise<ValidationResult> => {
    const pairs: TSchemaDataPair[] = [
      {schema: ProductEANSchemaInput, formData: {eankod: value}},
      {schema: ProductNumberSchemaInput, formData: {cikkszam: value}},
    ];

    const validTypes: string[] = [];
    let error: ZodError | null = null;

    for (let i = 0; i < pairs.length; i++) {
      const {schema, formData} = pairs[i];
      const validation = await validateZDTOForm(schema, formData);

      if (validation.isValid) {
        validTypes.push(Object.keys(formData)[0]);
      }

      if (validation.error) {
        error = validation.error;
      }
    }

    return {
      isValid: validTypes.length > 0,
      error:
        error ||
        new ZodError([
          {
            code: ZodIssueCode.custom,
            message: 'Nem megfelelő formátum, ellenőrizd az adatot!',
            path: [],
          },
        ]),
      validTypes: validTypes,
    };
  };

  const [
    errorMessage,
    searchQueryVal,
    changeHandlerResult,
    onChangeHandler,
    setErrorMessage,
  ] = useOnChangeHandler(
    validateFormArray,
    getProductByEAN,
    getProductByNumber,
    setSearchQuery,
  );
  const {isCameraActive, handleOnClose, clickCamera, setIsCameraActive} =
    useCamera(setErrorMessage as Dispatch<SetStateAction<string | null>>);
  const onBarCodeRead = useOnBarCodeRead(
    onChangeHandler as (value: string) => void,
    setIsCameraActive,
    beep,
  );

  if (isCameraActive) {
    return <VCamera onScan={onBarCodeRead} onClose={handleOnClose} />;
  }

  return (
    <View
      style={
        isDarkMode
          ? {...darkModeContent.darkContainer}
          : {...darkModeContent.lightContainer}
      }>
      <VInternetToast isVisible={!isConnected} />
      <VToast
        isVisible={wasDisconnected && isConnected}
        label={'Sikeres kapcsolat!'}
        type={ToastTypes.success}
        handleEvent={() => setWasDisconnected(false)}
      />
      {errorMessage && (
        <VAlert
          type={AlertTypes.error}
          title={'Hibás eankód!'}
          message={errorMessage as string}
        />
      )}
      <VBackButton navigation={navigation} />
      <View style={productStyles.container}>
        <View style={productStyles.innerView}>
          <VInput
            inputProps={{
              ref: inputRef,
              value: searchQuery,
              showSoftInputOnFocus:
                deviceType === DeviceInfoEnum.mobile || keyboardActive,
              autoFocus: true,
              onChangeText: setSearchQuery,
              onSubmitEditing: async () =>
                await (onChangeHandler as (value: string) => Promise<void>)(
                  searchQuery,
                ),
              placeholder: 'Keresés...',
              keyboardType: 'numeric',
              rightIcon: (
                <View style={productStyles.iconView}>
                  <Icon
                    type="antdesign"
                    name="search1"
                    size={25}
                    color={isDarkMode ? '#ffffff' : '#000000'}
                    disabled={!searchQuery || !isConnected}
                    disabledStyle={productStyles.iconDisabledStyle}
                    onPress={async () => {
                      await (
                        onChangeHandler as (value: string) => Promise<void>
                      )(searchQuery);
                    }}
                  />
                  {searchQuery && (
                    <Icon
                      type="antdesign"
                      name="closecircle"
                      size={25}
                      containerStyle={productStyles.iconContainerStyle}
                      color={isDarkMode ? '#fff' : '#000'}
                      onPress={() => {
                        setSearchQuery('');
                      }}
                    />
                  )}
                </View>
              ),
            }}
          />
        </View>
        <View style={productStyles.hamburgerMenuView}>
          <HamburgerMenu>
            {deviceType === DeviceInfoEnum.mobile && (
              <VCameraIconButton toggleCameraIcon={clickCamera} />
            )}
            {deviceType === DeviceInfoEnum.trekker && (
              <VKeyboardIconButton
                toggleKeyboard={() => {
                  setKeyboardActive(!keyboardActive);
                  setTimeout(() => {
                    inputRef.current?.blur();
                    setTimeout(() => {
                      inputRef.current?.focus();
                    }, TIMEOUT_DELAY);
                  }, TIMEOUT_DELAY);
                }}
              />
            )}
          </HamburgerMenu>
        </View>
        {Array.isArray(changeHandlerResult) &&
          changeHandlerResult?.map(
            (result: ZProductListOutput | Response, index: number) => (
              <View key={index}>
                {'status' in result && result.status === RESPONSE_SUCCESS && (
                  <View>
                    <VDataTable
                      data={
                        'count' in result &&
                        typeof result.count === 'number' &&
                        'data' in result &&
                        Array.isArray(result.data)
                          ? {data: result.data, count: result.count}
                          : {data: [{value: '', key: '', title: ''}], count: 0}
                      }
                    />
                    {/*<VCardSuccess*/}
                    {/*  title={'Találatok'}*/}
                    {/*  content={*/}
                    {/*    'count' in result &&*/}
                    {/*    typeof result.count === 'number' &&*/}
                    {/*    'data' in result &&*/}
                    {/*    Array.isArray(result.data)*/}
                    {/*      ? {data: result.data, count: result.count}*/}
                    {/*      : {data: [{value: '', key: '', title: ''}], count: 0}*/}
                    {/*  }*/}
                    {/*/>*/}
                  </View>
                )}
                {'status' in result &&
                  result.status === RESPONSE_NO_CONTENT && (
                    <View>
                      <VCardNotFound
                        title={'Not Found'}
                        value={searchQueryVal as string}
                      />
                    </View>
                  )}
              </View>
            ),
          )}
      </View>
    </View>
  );
};

export default Product;
