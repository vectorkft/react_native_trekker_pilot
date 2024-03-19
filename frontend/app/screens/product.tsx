import React, {JSX, useContext, useState} from 'react';
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

    for (let i = 0; i < pairs.length; i++) {
      const {schema, formData} = pairs[i];
      const validation = await validateZDTOForm(schema, formData);

      if (validation.isValid) {
        return {...validation, validType: Object.keys(formData)[0]};
      }
    }

    return {
      isValid: false,
      error: new ZodError([
        {
          code: ZodIssueCode.custom,
          message: 'Nem megfelelő formátum, ellenőrizd az adatot!',
          path: [],
        },
      ]),
      validType: null,
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
    useCamera(setErrorMessage);
  const onBarCodeRead = useOnBarCodeRead(
    onChangeHandler,
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
        <VAlert type="error" title={'Hibás eankód!'} message={errorMessage} />
      )}
      <VBackButton navigation={navigation} />
      <View style={{flex: 1, justifyContent: 'flex-start'}}>
        <View style={{marginLeft: '12%', width: '70%'}}>
          <VInput
            inputProps={{
              ref: inputRef,
              value: searchQuery,
              showSoftInputOnFocus: deviceType === 'mobile' || keyboardActive,
              autoFocus: true,
              onChangeText: setSearchQuery,
              onSubmitEditing: async () => await onChangeHandler(searchQuery),
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
                      await onChangeHandler(searchQuery);
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
          {deviceType === 'mobile' && (
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
        {changeHandlerResult?.status === 200 && (
          <View>
            <VDataTable data={changeHandlerResult} />
            {/*<VCardSuccess title={'Találatok'} content={changeHandlerResult} />*/}
          </View>
        )}
        {changeHandlerResult?.status === 204 && (
          <View>
            <VCardNotFound title={'Not Found'} value={searchQueryVal} />
          </View>
        )}
      </View>
    </View>
  );
};

export default Product;
