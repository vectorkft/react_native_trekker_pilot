import {AlertTypes} from '../enums/types';

export type Alert = {
  type: AlertTypes.error | AlertTypes.warning | AlertTypes.message;
  title: string;
  message: string;
};
