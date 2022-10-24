import { AxiosError } from 'axios';

export const isObjectEmpty = (prop: Record<string, unknown> | Error | AxiosError<unknown, any>) =>
  Object.keys(prop).length > 0;

export { categories } from './categories';
