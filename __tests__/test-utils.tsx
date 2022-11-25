import { render } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import renderer from 'react-test-renderer';
import theme from '../src/global/styles/theme';
import { Provider } from 'react-redux';
import store, { IRootState, reducers, sagaMiddleware } from './test-redux-store';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import sagas from '../src/store/sagas';

interface IAllThemeProviders {
  children: React.ReactElement;
  store?: EnhancedStore;
}

const AllTheProviders = ({ children }: IAllThemeProviders) => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </Provider>
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
  const reduxStore = configureStore({
    reducer: reducers,
    middleware: [sagaMiddleware],
    preloadedState: preloadedState
  });

  sagaMiddleware.run(sagas);

  return {
    render: render(
      <Provider store={reduxStore}>
        <ThemeProvider theme={theme}>{component}</ThemeProvider>;
      </Provider>
    ),
    store: reduxStore
  };
};

// re-export everything
export * from '@testing-library/react-native';

// override render method
export { customRender as render };
