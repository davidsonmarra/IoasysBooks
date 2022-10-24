import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import constants from '../../constants';
import api from '../../services/api';
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SET_AUTHORIZATIONS,
  LOGOUT
} from '../slices/profileSlice';

async function requestSignIn(email: string, password: string) {
  return await api
    .post('/auth/sign-in', {
      email,
      password
    })
    .then(response => response);
}

function* login({ payload: { email, password } }: ReturnType<typeof LOGIN>) {
  // 'desafio@ioasys.com.br'
  // '12341234'
  try {
    const { data, headers } = yield requestSignIn(email, password);
    yield put(
      SET_AUTHORIZATIONS({
        token: headers.authorization,
        id: data.id,
        refresh: headers['refresh-token']
      })
    );
    yield put(LOGIN_SUCCESS(headers.authorization));
  } catch (error) {
    if (error instanceof AxiosError || error instanceof Error) yield put(LOGIN_FAILURE(error));
    else throw error;
  }
}

async function store(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log('Erro durante o armazenamento do token:', error);
  }
}

export function* setAuthorizations({ payload }: ReturnType<typeof SET_AUTHORIZATIONS>) {
  yield call(store, constants.asyncStorageUserKey, payload.token);
  yield call(store, constants.asyncStorageUserId, payload.id);
  yield call(store, constants.asyncStorageUserRefresh, payload.refresh);
}

async function clearUserData() {
  await AsyncStorage.removeItem(constants.asyncStorageUserKey);
  await AsyncStorage.removeItem(constants.asyncStorageUserId);
  await AsyncStorage.removeItem(constants.asyncStorageUserRefresh);
}

export default function* watcher() {
  yield all([
    takeLatest(LOGIN, login),
    takeLatest(SET_AUTHORIZATIONS, setAuthorizations),
    takeLatest(LOGOUT, clearUserData)
  ]);
}
