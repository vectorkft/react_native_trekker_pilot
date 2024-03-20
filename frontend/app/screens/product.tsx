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
import VCardSuccess from '../components/Vcard-succes';
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

    let validTypes: string[] = [];
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

  // TODO: Hamburger menü, ha egy ikon van akkor csak az, ha több akkor hamburger menü

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
        type={'check'}
        handleEvent={() => setWasDisconnected(false)}
      />
      {errorMessage && (
        <VAlert
          type="error"
          title={'Hibás eankód!'}
          message={errorMessage as string}
        />
      )}
      <VBackButton navigation={navigation} />
      <View style={{flex: 1, justifyContent: 'flex-start'}}>
        <View style={{marginLeft: '12%', width: '70%'}}>
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
                <View style={{flexDirection: 'row'}}>
                  <Icon
                    type="antdesign"
                    name="search1"
                    size={25}
                    color={isDarkMode ? '#ffffff' : '#000000'}
                    disabled={!searchQuery || !isConnected}
                    disabledStyle={{backgroundColor: 'transparent'}}
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
                      containerStyle={{marginLeft: 10}}
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
        <View style={{marginLeft: '80%', marginTop: -60}}>
          {deviceType === DeviceInfoEnum.mobile && (
            <VCameraIconButton toggleCameraIcon={clickCamera} />
          )}
          {deviceType === 'trekker' && (
            <VKeyboardIconButton
              toggleKeyboard={() => {
                setKeyboardActive(!keyboardActive);
                setTimeout(() => {
                  inputRef.current?.blur();
                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 100);
                }, 100);
              }}
            />
          )}
        </View>
        {Array.isArray(changeHandlerResult) &&
          changeHandlerResult?.map(
            (result: ZProductListOutput | Response, index: number) => (
              <View key={index}>
                {'status' in result && result.status === 200 && (
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
                    {/*<VCardSuccess title={'Találatok'} content={result} />*/}
                  </View>
                )}
                {'status' in result && result.status === 204 && (
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
