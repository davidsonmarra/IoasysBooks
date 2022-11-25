import { Routes } from '../../src/routes';
import { LOGIN_ON_START } from '../../src/store/slices/profileSlice';
import { mockPreloadedStateEmpty } from '../../__mocks__';
import {
  act,
  cleanup,
  waitFor,
  matchSnapshotWithProviders,
  renderWithCustomProviders
} from '../test-utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../src/constants';
import { server } from '../jest.setup';

describe('Routes', () => {
  beforeAll(async () => {
    server.listen();
    await waitFor(() =>
      act(
        async () =>
          await AsyncStorage.setItem(constants.asyncStorageUserRefresh, 'test-refresh-token')
      )
    );
  });

  afterEach(() => {
    cleanup();
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it('should match a snapshot', async () => {
    await waitFor(() => act(() => matchSnapshotWithProviders(<Routes />)));
  });

  it('should changes routes correctly', async () => {
    const {
      render: { getByTestId },
      store
    } = renderWithCustomProviders(<Routes />, mockPreloadedStateEmpty);
    await act(async () => {
      const signInScreen = getByTestId('SignInScreen');
      expect(signInScreen).toBeTruthy();
    });
    await waitFor(() => expect(store.getState().profile.isLogged).toBeTruthy());
    const homeScreen = getByTestId('HomeScreen');
    expect(homeScreen).toBeTruthy();
  });

  it('should works correctly when are no token', async () => {
    await waitFor(() =>
      act(async () => await AsyncStorage.removeItem(constants.asyncStorageUserRefresh))
    );
    const { store } = renderWithCustomProviders(<Routes />, mockPreloadedStateEmpty);
    await waitFor(() => act(() => store.dispatch(LOGIN_ON_START())));
    expect(store.getState().profile.isLogged).toBeFalsy();
  });

  it('should works correctly when as api error', async () => {
    await waitFor(() =>
      act(
        async () =>
          await AsyncStorage.setItem(constants.asyncStorageUserRefresh, 'error-test-token')
      )
    );
    const { store } = renderWithCustomProviders(<Routes />, mockPreloadedStateEmpty);

    await waitFor(() => act(() => store.dispatch(LOGIN_ON_START())));
    expect(store.getState().profile.error.name).toEqual('AxiosError');
  });
});
