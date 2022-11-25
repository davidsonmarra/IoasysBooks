import axios, { AxiosRequestHeaders } from 'axios';
import callbackRequest from './interceptors/callbacks/request/request';

const createApiService = (baseURL: string, timeout: number, headers: AxiosRequestHeaders) => {
  const api = axios.create({
    baseURL,
    timeout: timeout,
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    }
  });

  api.interceptors.request.use(config => callbackRequest(config));

  return api;
};

export default createApiService;
