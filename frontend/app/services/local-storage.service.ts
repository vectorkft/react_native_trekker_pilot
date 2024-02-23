import AsyncStorage from '@react-native-async-storage/async-storage';

export const AsyncStorageService = {

    multiGet: async (keys: string[]) => {
        const values = await AsyncStorage.multiGet(keys);
        return values.map(([key, value]) => [key, JSON.parse(value)]);
    },

    multiSet: async (keyValuePairs: [string, any][]) => {
        const pairs: [string, string][] = keyValuePairs.map(([key, value]) => [key, JSON.stringify(value)]);
        await AsyncStorage.multiSet(pairs);
    },

    multiRemove: async (keys: string[]) => {
        await AsyncStorage.multiRemove(keys);
    },

};
