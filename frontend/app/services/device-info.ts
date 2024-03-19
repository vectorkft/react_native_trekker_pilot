import {useEffect} from 'react';
import DeviceInfo from 'react-native-device-info';
import {
  DeviceInfoDTO,
  ZDeviceInfoDTO,
} from '../../../shared/dto/device-info.dto';
import {LocalStorageService} from './local-storage';
import * as Sentry from '@sentry/react-native';
const DeviceInfoList = () => {
  useEffect(() => {
    (() => {
      const deviceData: ZDeviceInfoDTO = {
        brand: DeviceInfo.getBrand(),
        deviceId: DeviceInfo.getDeviceId(),
        deviceName: DeviceInfo.getDeviceNameSync(),
        manufacturer: DeviceInfo.getManufacturerSync(),
      };

      const result = DeviceInfoDTO.safeParse(deviceData);

      if (result.success) {
        try {
          LocalStorageService.storeData({
            deviceData: JSON.stringify(deviceData),
          });
        } catch (error) {
          Sentry.captureException(error);
          throw error;
        }
      } else {
        Sentry.captureException(new Error('Hibás formátum!'));
        throw new Error('Hibás formátum!');
      }
    })();
  }, []);

  return null;
};

export default DeviceInfoList;
