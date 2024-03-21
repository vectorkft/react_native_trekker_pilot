import React, {JSX, useContext, useState} from 'react';
import {View} from 'react-native';
import {ProductService} from '../services/product';
import {
  parseZodError,
  validateZDTOForm,
} from '../../../shared/services/zod-dto.service';
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
} from '../../../shared/dto/product.dto';
import {useStore} from '../states/zustand';
import VInternetToast from '../components/Vinternet-toast';
import VToast from '../components/Vtoast';
import VDataTable from '../components/Vdata-table';
import {Icon} from 'react-native-elements';
import {ZodError, ZodIssueCode} from 'zod';
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
import {ValidTypes} from '../../../shared/enums/types';
import {TSchemaDataPair} from '../interfaces/t-schema-data-pair';
import {useAlert} from '../states/use-alert';
import * as Sentry from '@sentry/react';
import {CameraService, useCamera} from '../services/camera';

const Product = ({navigation}: AppNavigation): JSX.Element => {
  const {isDarkMode} = useContext(DarkModeContext);
  const {errorMessage, setErrorMessage} = useAlert();
  const {isCameraActive, setIsCameraActive, handleOnClose, clickCamera} =
    useCamera();
  const {setWasDisconnected, deviceType} = useStore.getState();
  const isConnected = useStore(state => state.isConnected);
  const wasDisconnected = useStore(state => state.wasDisconnected);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchQueryVal, setSearchQueryVal] = useState('');
  const [changeHandlerResult, setChangeHandlerResult] = useState<
    ZProductListOutput | Response | undefined
  >(undefined);
  const [keyboardActive, setKeyboardActive] = useState(false);
  const {inputRef} = useInputChange(searchQuery);

  const validateFormArray = async (
    value: string,
  ): Promise<ValidationResult> => {
    const pairs: TSchemaDataPair[] = [
      {
        schema: ProductEANSchemaInput,
        formData: {value: value, validType: ValidTypes.ean},
      },
      {
        schema: ProductNumberSchemaInput,
        formData: {value: value, validType: ValidTypes.etk},
      },
    ];

    const validTypes: string[] = [];
    const MAX_LENGTH_ARRAY = 2;
    let error: ZodError | null = null;

    for (let i = 0; i < pairs.length; i++) {
      const {schema, formData} = pairs[i];
      const validation = await validateZDTOForm(schema, formData);

      if (validation.isValid) {
        validTypes.push(formData.validType);
      }

      if (validation.error) {
        error = validation.error;
      }
    }

    let resultType = '';
    if (validTypes.length === MAX_LENGTH_ARRAY) {
      resultType = ValidTypes.both;
    } else if (validTypes.length === 1) {
      resultType = validTypes[0];
    }

    return {
      isValid: validTypes.length > 0,
      validType: resultType as ValidTypes,
      error:
        error ||
        new ZodError([
          {
            code: ZodIssueCode.custom,
            message: 'Nem megfelelő formátum, ellenőrizd az adatot!',
            path: [],
          },
        ]),
    };
  };

  const handleValidationError = async (validation: ValidationResult) => {
    if (!validation.isValid) {
      const msg = await parseZodError(validation.error as ZodError);
      setErrorMessage(msg);
      setSearchQuery('');
      return false;
    }
    return true;
  };

  const getProduct = async (barcode?: string) => {
    try {
      const validateResult = await validateFormArray(
        searchQuery || (barcode as string),
      );
      const errorHandled = await handleValidationError(validateResult);

      if (!errorHandled) {
        return;
      }

      const res = await ProductService.getProduct({
        value: searchQuery || (barcode as string),
        validType: validateResult.validType as ValidTypes,
      });

      setChangeHandlerResult(res);
      setSearchQueryVal(searchQuery || (barcode as string));
      setSearchQuery('');
    } catch (e) {
      Sentry.captureException(e);
      setErrorMessage('Hiba történt próbálja újra!');
    }
  };

  const {onBarCodeRead} = CameraService.useOnBarCodeRead(
    getProduct,
    setIsCameraActive,
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
              onSubmitEditing: () => getProduct(),
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
                    onPress={() => getProduct()}
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
                title={'Not Found'}
                value={searchQueryVal as string}
              />
            </View>
          )}
      </View>
    </View>
  );
};

export default Product;
