import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PublicRoutes } from './stacks/public.routes';
import { useSelector } from 'react-redux';
import { IRootState } from '../store/store';
import { AuthRoutes } from './stacks/auth.routes';

export function Routes() {
  const { isLogged } = useSelector(({ profile }: IRootState) => profile);

  return <NavigationContainer>{isLogged ? <AuthRoutes /> : <PublicRoutes />}</NavigationContainer>;
}
