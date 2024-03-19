import {ZDeviceInfoDTO} from "../../../shared/dto/device-info.dto";
import DeviceInfo from "react-native-device-info";

export enum DeviceInfoEnum {
  mobile = 'mobile',
  trekker = 'trekker',
}

export const deviceData: ZDeviceInfoDTO = {
  brand: DeviceInfo.getBrand(),
  deviceId: DeviceInfo.getDeviceId(),
  deviceName: DeviceInfo.getDeviceNameSync(),
  manufacturer: DeviceInfo.getManufacturerSync(),
};
