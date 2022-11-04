import { render } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import renderer from 'react-test-renderer';
import theme from '../src/global/styles/theme';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store, { IRootState, reducers, sagaMiddleware } from './test-redux-store';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';

interface IAllThemeProviders {
  children: React.ReactElement;
  store?: EnhancedStore;
}

const AllTheProviders = ({ children }: IAllThemeProviders) => (
  <NavigationContainer>
    <Provider store={store}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Provider>
  </NavigationContainer>
);

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export const matchSnapshotWithProviders = (component: React.ReactElement) => {
  const tree = renderer.create(<AllTheProviders>{component}</AllTheProviders>).toJSON();
  expect(tree).toMatchSnapshot();
};

export const renderWithCustomProviders = (
  component: React.ReactElement,
  preloadedState: IRootState
) => {
  console.log(preloadedState);
  const reduxStore = configureStore({
    reducer: reducers,
    middleware: [sagaMiddleware],
    preloadedState: preloadedState
  });

  return {
    render: render(
      <NavigationContainer>
        <Provider store={reduxStore}>
          <ThemeProvider theme={theme}>{component}</ThemeProvider>;
        </Provider>
      </NavigationContainer>
    ),
    store: reduxStore
  };
};

// re-export everything
export * from '@testing-library/react-native';

// override render method
export { customRender as render };
