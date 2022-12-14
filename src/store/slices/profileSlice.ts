import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

interface Props {
  email: string;
  token: string;
  error: Error | AxiosError;
  errorOnStart: Error | AxiosError;
  isLogged: boolean;
  isLoading: boolean;
}

interface ILogin {
  email: string;
  password: string;
}

interface IToken {
  token: string;
  id: string;
  refresh: string;
}

const initialState: Props = {
  email: '',
  token: '',
  error: {} as Error | AxiosError,
  errorOnStart: {} as Error | AxiosError,
  isLogged: false,
  isLoading: false
};

const profileSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    LOGIN: (state, { payload }: PayloadAction<ILogin>) => ({
      ...state,
      email: payload.email,
      error: {} as Error | AxiosError,
      isLoading: true
    }),
    LOGIN_ON_START: state => ({
      ...state
    }),
    LOGIN_SUCCESS: (state, { payload }: PayloadAction<string>) => ({
      ...state,
      token: payload,
      isLogged: true,
      isLoading: false
    }),
    LOGIN_FAILURE: (state, { payload }: PayloadAction<Error | AxiosError>) => ({
      ...state,
      error: payload,
      isLoading: false
    }),
    LOGIN_FAILURE_ON_START: (state, { payload }: PayloadAction<Error | AxiosError>) => ({
      ...state,
      errorOnStart: payload,
      isLoading: false
    }),
    SET_AUTHORIZATIONS: (state, { payload }: PayloadAction<IToken>) => ({
      ...state,
      token: payload.token
    }),
    LOGOUT: state => ({
      ...state,
      email: '',
      password: '',
      token: '',
      isLogged: false
    })
  }
});

const { actions, reducer } = profileSlice;

export const {
  LOGIN,
  LOGIN_ON_START,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_FAILURE_ON_START,
  SET_AUTHORIZATIONS,
  LOGOUT
} = actions;
export default reducer;
