import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BookDetailsScreen, HomeScreen } from '../screens';

import AuthRootStackParamList from '../../@types/AuthRootStackParamList';

const { Navigator, Screen } = createNativeStackNavigator<AuthRootStackParamList>();

export function AuthRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false
      }}
      initialRouteName='HomeScreen'
    >
      <Screen name='HomeScreen' component={HomeScreen} />
      <Screen name='BookDetailsScreen' component={BookDetailsScreen} />
    </Navigator>
  );
}
