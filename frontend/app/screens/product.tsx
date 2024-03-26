import React, {JSX, useContext, useState} from 'react';
import {View} from 'react-native';
import {ProductService} from '../services/product';
import {parseZodError, validateFormArray} from '../../../shared/services/zod';
import VCardNotFound from '../components/Vcard-not-found';
import VCamera from '../components/Vcamera';
import VCameraIconButton from '../components/Vcamera-icon-button';
import VInput from '../components/Vinput';
import VAlert from '../components/Valert';
import {useInputChange} from '../states/use-product';
import VBackButton from '../components/Vback-button';
import {AppNavigation} from '../interfaces/navigation';
import {
  ProductEANSchemaInput,
  ProductNumberSchemaInput,
  ZProductListOutput,
} from '../../../shared/dto/product';
import {useStore} from '../states/zustand';
import VInternetToast from '../components/Vinternet-toast';
import VToast from '../components/Vtoast';
import VDataTable from '../components/Vdata-table';
import {Icon} from 'react-native-elements';
import VKeyboardIconButton from '../components/Vkeyboard-icon-button';
import {DarkModeContext} from '../providers/dark-mode';
import {DeviceInfoEnum} from '../../../shared/enums/device-info';
import HamburgerMenu from '../components/Vhamburger-menu';
import {productStyles} from '../styles/product-screen';
import {
  RESPONSE_NO_CONTENT,
  RESPONSE_SUCCESS,
} from '../constants/response-status';
import {AlertTypes, ToastTypes} from '../enums/types';
import {ValidTypes} from '../../../shared/enums/types';
import {useAlert} from '../states/use-alert';
import {CameraService, useCamera} from '../services/camera';
import {colors} from '../enums/colors';
import {ZodError} from 'zod';
import {ValidatedValue} from '../interfaces/types';
import {ErrorContext} from '../providers/error';

const Product = ({navigation}: AppNavigation): JSX.Element => {
  const TIMEOUT_DELAY = 100;
  const {isDarkMode} = useContext(DarkModeContext);
  const {setError} = useContext(ErrorContext);
  const {errorMessage, setErrorMessage} = useAlert();
  const {isCameraActive, setIsCameraActive, handleOnClose, clickCamera} =
    useCamera(setErrorMessage);
  const {setWasDisconnected, deviceType} = useStore.getState();
  const isConnected = useStore(state => state.isConnected);
  const wasDisconnected = useStore(state => state.wasDisconnected);
  const [searchValue, setSearchValue] = React.useState('');
  const [searchValueSave, setSearchValueSave] = useState('');
  const [changeHandlerResult, setChangeHandlerResult] = useState<
    ZProductListOutput | Response | undefined
  >(undefined);
  const [keyboardActive, setKeyboardActive] = useState(false);
  const {inputRef} = useInputChange(searchValue);

  const handleError = async (error: ZodError) => {
    parseZodError(error).then(resp => {
      setErrorMessage(resp);
      setSearchValue('');
    });
  };

  const handleSuccess = async (formData: ValidatedValue) => {
    ProductService.getProduct(formData, setError).then(res => {
      setChangeHandlerResult(res);
      setSearchValue('');
    });
  };

  const getProduct = async (value: string) => {
    const checkedValue = value.replace(/[\x00-\x20\x7F-\x9F]/g, '');
    setErrorMessage(null);

    await validateFormArray(
      checkedValue,
      {
        propList: [
          {type: ValidTypes.ean, parseType: ProductEANSchemaInput},
          {type: ValidTypes.etk, parseType: ProductNumberSchemaInput},
        ],
      },
      handleError,
      handleSuccess,
    );

    setSearchValueSave(checkedValue);
  };

  const {onBarCodeRead} = CameraService.useOnBarCodeRead(
    getProduct,
    setIsCameraActive,
  );

  if (isCameraActive) {
    return <VCamera onScan={onBarCodeRead} onClose={handleOnClose} />;
  }

  return (
    <View style={productStyles(isDarkMode).mainContainer}>
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
          message={errorMessage}
        />
      )}
      <VBackButton navigation={navigation} />
      <View style={productStyles().container}>
        <View style={productStyles().innerView}>
          <VInput
            inputProps={{
              ref: inputRef,
              value: searchValue,
              showSoftInputOnFocus:
                deviceType === DeviceInfoEnum.mobile || keyboardActive,
              autoFocus: true,
              onChangeText: setSearchValue,
              onSubmitEditing: async () => {
                if (!searchValue.trim()) {
                  setTimeout(() => {
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }, TIMEOUT_DELAY);
                  return;
                } else {
                  await getProduct(searchValue);
                }
              },
              placeholder: 'Keresés...',
              keyboardType: 'numeric',
              rightIcon: (
                <View style={productStyles().iconView}>
                  <Icon
                    type="antdesign"
                    name="search1"
                    size={25}
                    color={
                      isDarkMode ? colors.lightContent : colors.darkContent
                    }
                    disabled={!searchValue || !isConnected}
                    disabledStyle={productStyles().iconDisabledStyle}
                    onPress={() => getProduct(searchValue)}
                  />
                  {searchValue && (
                    <Icon
                      type="antdesign"
                      name="closecircle"
                      size={25}
                      containerStyle={productStyles().iconContainerStyle}
                      color={
                        isDarkMode ? colors.lightContent : colors.darkContent
                      }
                      onPress={() => {
                        setSearchValue('');
                      }}
                    />
                  )}
                </View>
              ),
            }}
          />
        </View>
        <View style={productStyles().hamburgerMenuView}>
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
        {changeHandlerResult &&
          'status' in changeHandlerResult &&
          changeHandlerResult.status === RESPONSE_SUCCESS && (
            <View>
              <VDataTable
                data={changeHandlerResult as unknown as ZProductListOutput}
              />
              {/*<VCardSuccess title={'Találatok'} content={changeHandlerResult} />*/}
            </View>
          )}
        {changeHandlerResult &&
          'status' in changeHandlerResult &&
          changeHandlerResult.status === RESPONSE_NO_CONTENT && (
            <View>
              <VCardNotFound
                title={'Nem található'}
                value={searchValueSave as string}
              />
            </View>
          )}
      </View>
    </View>
  );
};

export default Product;
