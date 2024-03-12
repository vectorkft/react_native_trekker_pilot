import {MMKV} from 'react-native-mmkv';

export const LocalStorageService = {
  storeData: (data: Record<string, string | boolean>) => {
    const storage = new MMKV({
      id: 'app',
    });

    Object.entries(data).forEach(([key, value]) => {
      storage.set(key, value);
    });
  },

  deleteData: (keys: string[]) => {
    const storage = new MMKV({
      id: 'app',
    });

    keys.forEach(key => {
      storage.delete(key);
    });
  },

  getDataString: (keys: string[]): Record<string, string | undefined> => {
    const storage = new MMKV({
      id: 'app',
    });

    const data: Record<string, string | undefined> = {};

    keys.forEach(key => {
      data[key] = storage.getString(key);
    });

    return data;
  },

  getDataBoolean: (keys: string[]): Record<string, boolean | undefined> => {
    const storage = new MMKV({
      id: 'app',
    });

    const data: Record<string, boolean | undefined> = {};

    keys.forEach(key => {
      data[key] = storage.getBoolean(key);
    });

    return data;
  },
};
