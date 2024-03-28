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
} from '../../../shared/dto/product';
import {useStore} from '../states/zustand';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
import {AlertType} from '../enums/type';
import {ValidTypes} from '../../../shared/enums/type';
import {useAlert} from '../states/use-alert';
import {CameraService, useCamera} from '../services/camera';
import {Color} from '../enums/color';
import {ZodError} from 'zod';
import {ErrorContext} from '../providers/error';
import {ApiResponseOutput} from '../types/api-response';
import VMenu from '../components/VMenu';
import * as Sentry from '@sentry/react-native';
import VCardSuccess from '../components/Vcard-succes';
import {ValidatedValue} from '../../../shared/interfaces/validation-result';
import withNetInfo from '../components/with-net-info';

const Product = ({navigation}: AppNavigation): JSX.Element => {
  const TIMEOUT_DELAY = 100;
  const {isDarkMode} = useContext(DarkModeContext);
  const {setError} = useContext(ErrorContext);
  const {errorMessage, setErrorMessage} = useAlert();
  const {isCameraActive, setIsCameraActive, handleOnClose, clickCamera} =
    useCamera(setErrorMessage);
  const {deviceType} = useStore.getState();
  const [searchValue, setSearchValue] = React.useState('');
  const [searchValueSave, setSearchValueSave] = useState('');
  const [changeHandlerResult, setChangeHandlerResult] =
    useState<ApiResponseOutput>();
  const [keyboardActive, setKeyboardActive] = useState(false);
  const {inputRef} = useInputChange(searchValue);

  const handleError = async (error: ZodError) => {
    const msg = await parseZodError(error);
    setErrorMessage(msg);
    setSearchValue('');
    setChangeHandlerResult(undefined);
  };

  const handleSuccess = async (formData: ValidatedValue) => {
    const res = await ProductService.getProduct(formData, setError);
    setChangeHandlerResult(res);
    setSearchValue('');
  };

  const getProduct = async (value: string) => {
    const checkedValue = value.replace(/[\x00-\x20\x7F-\x9F]/g, '');
    setErrorMessage(null);

    await validateFormArray(
      checkedValue,
      {
        propList: [
          {name: ValidTypes.ean, parseType: ProductEANSchemaInput},
          {name: ValidTypes.etk, parseType: ProductNumberSchemaInput},
        ],
      },
      handleError,
      handleSuccess,
    );

    setSearchValueSave(checkedValue);
  };

  const handleCameraSuccess = async (value: string) => {
    try {
      await getProduct(value);
    } catch (error) {
      Sentry.captureMessage('A hang nem játszódott le!', 'warning');
    } finally {
      setIsCameraActive(false);
    }
  };

  const {onBarCodeRead} = CameraService.useOnBarCodeRead(handleCameraSuccess);

  if (isCameraActive) {
    return <VCamera onScan={onBarCodeRead} onClose={handleOnClose} />;
  }

  return (
    <View style={productStyles(isDarkMode).mainContainer}>
      {errorMessage && (
        <VAlert
          type={AlertType.error}
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
                    color={isDarkMode ? Color.lightContent : Color.darkContent}
                    disabled={!searchValue}
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
                        isDarkMode ? Color.lightContent : Color.darkContent
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
            <VMenu />
          </HamburgerMenu>
        </View>
        {changeHandlerResult?.status === RESPONSE_SUCCESS && (
          <View>
            {/*<VDataTable data={changeHandlerResult.data} />*/}
            <VCardSuccess
              title={'Találatok'}
              content={changeHandlerResult.data}
            />
          </View>
        )}
        {changeHandlerResult?.status === RESPONSE_NO_CONTENT && (
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

export default withNetInfo(Product);
