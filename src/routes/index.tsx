import React, { useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PublicRoutes } from './stacks/public.routes';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store/store';
import { AuthRoutes } from './stacks/auth.routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../constants';
import { LOGIN_ON_START } from '../store/slices/profileSlice';

export function Routes() {
  const dispatch = useDispatch();
  const { isLogged } = useSelector(({ profile }: IRootState) => profile);

  const isTokenSave = useCallback(async () => {
    const token = await AsyncStorage.getItem(constants.asyncStorageUserRefresh);
    return !!token;
  }, []);

  const handleLoginOnStart = useCallback(async () => {
    (await isTokenSave()) && dispatch(LOGIN_ON_START());
  }, []);

  useEffect(() => {
    handleLoginOnStart();
  }, []);

  return <NavigationContainer>{isLogged ? <AuthRoutes /> : <PublicRoutes />}</NavigationContainer>;
}
