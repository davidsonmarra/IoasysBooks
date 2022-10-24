import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PublicRoutes } from './stacks/public.routes';

export function Routes() {
  return (
    <NavigationContainer>
      <PublicRoutes />
    </NavigationContainer>
  );
}
