import {AlertType} from '../enums/type';

export type Alert = {
  type: AlertType;
  title: string;
  message: string;
};
