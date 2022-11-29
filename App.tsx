/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { StatusBar } from 'react-native';
import theme from './src/global/styles/theme';
import { Routes } from './src/routes';
import Toast, { ErrorToast, ToastOptions } from 'react-native-toast-message';
import { RFValue } from 'react-native-responsive-fontsize';
import store from './src/store';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

function App() {
  const toastConfig = {
    error: (props: ToastOptions) => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: RFValue(12)
        }}
        text2Style={{
          fontSize: RFValue(12)
        }}
      />
    )
  };

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <StatusBar barStyle='dark-content' backgroundColor={theme.colors.background} translucent />
        <Routes />
        <Toast config={toastConfig} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
