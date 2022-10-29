import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import constants from '../../constants';
import api from '../../services/api';
import {
  LOGIN,
  LOGIN_ON_START,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SET_AUTHORIZATIONS,
  LOGOUT
} from '../slices/profileSlice';

async function requestSignIn(email: string, password: string) {
  return api
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

export function* loginOnStart() {
  const token: string = yield call(AsyncStorage.getItem, constants.asyncStorageUserRefresh);
  if (token) {
    try {
      const { headers } = yield call(
        api.post,
        '/auth/refresh-token',
        {
          refreshToken: token
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const id: string = yield call(AsyncStorage.getItem, constants.asyncStorageUserId);
      yield put(
        SET_AUTHORIZATIONS({ token: headers.authorization, id, refresh: headers['refresh-token'] })
      );
      yield put(LOGIN_SUCCESS(headers.authorization));
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError || error instanceof Error) yield put(LOGIN_FAILURE(error));
    }
  }
}

export default function* watcher() {
  yield all([
    takeLatest(LOGIN, login),
    takeLatest(LOGIN_ON_START, loginOnStart),
    takeLatest(SET_AUTHORIZATIONS, setAuthorizations),
    takeLatest(LOGOUT, clearUserData)
  ]);
}
