import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosRequestConfig } from 'axios';
import constants from '../../../../constants';

const callbackRequest = async (config: AxiosRequestConfig) => {
  const configuration = config;
  const token = await AsyncStorage.getItem(constants.asyncStorageUserKey);
  if (token) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    configuration.headers!['Authorization'] = `Bearer ${token}`;
  }
  return configuration;
};

export default callbackRequest;
