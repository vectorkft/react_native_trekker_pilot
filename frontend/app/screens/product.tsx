import React, {JSX, useContext, useState} from 'react';
import {View} from 'react-native';
import {ProductsService} from '../services/products.service';
import {validateZDTOForm} from '../../../shared/services/zod-dto.service';
import VcardNotFound from '../components/Vcard-not-found';
import Vcamera from '../components/Vcamera';
import VcameraIconButton from '../components/Vcamera-icon-button';
import Vinput from '../components/Vinput';
import Valert from '../components/Valert';
import {useInputChange, useOnChangeHandler} from '../states/use-product-states';
import VbackButton from '../components/Vback-button';
import {RouterProps} from '../interfaces/navigation-props';
import {
  ProductEANSchemaInput,
  ProductNumberSchemaInput,
} from '../../../shared/dto/product.dto';
import {useStore} from '../states/zustand-states';
import VinternetToast from '../components/Vinternet-toast';
import Vtoast from '../components/Vtoast';
import VdataTable from '../components/Vdata-table';
import VCardSuccess from '../components/Vcard-succes';
import {
  useBeepSound,
  useCamera,
  useOnBarCodeRead,
} from '../states/use-camera-states';
import {Icon} from 'react-native-elements';
import {ZodError, ZodIssueCode} from 'zod';
import {ValidateForm} from '../interfaces/validate-form';
import {darkModeContent} from '../styles/dark-mode-content.stylesheet';
import {LocalStorageService} from '../services/local-storage.service';
import VKeyboardIcon from '../components/Vkeyboard-icon';
import {DarkModeContext} from '../providers/dark-mode';

const Product = ({navigation}: RouterProps): JSX.Element => {
  const {isDarkMode} = useContext(DarkModeContext);
  const {setWasDisconnected} = useStore.getState();
  const isConnected = useStore(state => state.isConnected);
  const wasDisconnected = useStore(state => state.wasDisconnected);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [keyboardActive, setKeyboardActive] = useState(false);
  const {inputRef} = useInputChange(searchQuery);
  const beep = useBeepSound();
  const getProductByEAN = async (value: string) => {
    return await ProductsService.getProductByEAN({eankod: value});
  };

  const getProductByNumber = async (value: string) => {
    return await ProductsService.getProductByNumber({cikkszam: value});
  };

  const validateFormArray = async (value: string): Promise<ValidateForm> => {
    const eanValidation = await validateZDTOForm(ProductEANSchemaInput, {
      eankod: value,
    });
    if (eanValidation.isValid) {
      return {...eanValidation, validType: 'ean'};
    } else {
      const numberValidation = await validateZDTOForm(
        ProductNumberSchemaInput,
        {cikkszam: value},
      );
      if (numberValidation.isValid) {
        return {...numberValidation, validType: 'number'};
      }
    }
    return {
      isValid: false,
      error: new ZodError([
        {
          code: ZodIssueCode.custom,
          message: 'Nem megfelelő adat!',
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
    return <Vcamera onScan={onBarCodeRead} onClose={handleOnClose} />;
  }

  return (
    <View
      style={
        isDarkMode
          ? {...darkModeContent.darkContainer}
          : {...darkModeContent.lightContainer}
      }>
      <VinternetToast isVisible={!isConnected} />
      <Vtoast
        isVisible={wasDisconnected && isConnected}
        label={'Sikeres kapcsolat!'}
        type={'check'}
        handleEvent={() => setWasDisconnected(false)}
      />
      {errorMessage && (
        <Valert type="error" title={'Hibás eankód!'} message={errorMessage} />
      )}
      <VbackButton navigation={navigation} />
      <View style={{flex: 1, justifyContent: 'flex-start'}}>
        <View style={{marginLeft: '12%', width: '70%'}}>
          <Vinput
            inputProps={{
              ref: inputRef,
              value: searchQuery,
              showSoftInputOnFocus:
                !LocalStorageService.getDataString([
                  'deviceData',
                ]).deviceData?.includes('Zebra') || keyboardActive,
              autoFocus: !searchQuery,
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
          <VcameraIconButton onPress={clickCamera} />
          <VKeyboardIcon
            toggleKeyboard={() => setKeyboardActive(!keyboardActive)}
          />
        </View>
        {changeHandlerResult?.status === 200 && (
          <View>
            <VdataTable data={changeHandlerResult} />
            {/*<VCardSuccess title={'Találatok'} content={changeHandlerResult} />*/}
          </View>
        )}
        {changeHandlerResult?.status === 204 && (
          <View>
            <VcardNotFound title={'Not Found'} value={searchQueryVal} />
          </View>
        )}
      </View>
    </View>
  );
};

export default Product;
