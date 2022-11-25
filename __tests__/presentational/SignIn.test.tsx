import { SignIn } from '../../src/presentational';
import { mockPreloadedStateEmpty } from '../../__mocks__';
import {
  matchSnapshotWithProviders,
  fireEvent,
  renderWithCustomProviders,
  act,
  waitFor,
  cleanup
} from '../test-utils';
import { server } from '../jest.setup';
import Toast from 'react-native-toast-message';
import { Platform } from 'react-native';

describe('Sign In', () => {
  it('should match a snapshot', () => {
    matchSnapshotWithProviders(<SignIn />);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it('should login work correctly', async () => {
    Object.defineProperty(Platform, 'OS', { get: jest.fn(() => 'android') });
    server.listen();
    const {
      render: { getByTestId, getByText },
      store
    } = renderWithCustomProviders(<SignIn />, mockPreloadedStateEmpty);
    const inputEmail = getByTestId(/input-email/i);
    const inputPassword = getByTestId(/input-password/i);

    fireEvent.changeText(inputEmail, 'desafio@ioasys.com.br');
    fireEvent.changeText(inputPassword, '12341234');

    const submitButton = getByText(/entrar/i);

    expect(store.getState().profile.email).toBeFalsy();
    await waitFor(() => act(() => fireEvent.press(submitButton)));
    expect(store.getState().profile.email).toEqual('desafio@ioasys.com.br');
  });

  it('should login render correctly at api error ', async () => {
    server.listen();
    const {
      render: { getByTestId, getByText },
      store
    } = renderWithCustomProviders(<SignIn />, mockPreloadedStateEmpty);
    const inputEmail = getByTestId(/input-email/i);
    const inputPassword = getByTestId(/input-password/i);

    fireEvent.changeText(inputEmail, 'error@ioasys.com.br');
    fireEvent.changeText(inputPassword, '12341234');

    const submitButton = getByText(/entrar/i);

    expect(store.getState().profile.error).toStrictEqual({});
    await waitFor(() => act(() => fireEvent.press(submitButton)));
    expect(store.getState().profile.error.name).toStrictEqual('AxiosError');
  });

  it('should login render correctly at form error in email field', async () => {
    const mockedShowToast = jest.spyOn(Toast, 'show');

    const {
      render: { getByTestId, getByText }
    } = renderWithCustomProviders(<SignIn />, mockPreloadedStateEmpty);
    const inputEmail = getByTestId(/input-email/i);
    const inputPassword = getByTestId(/input-password/i);

    fireEvent.changeText(inputEmail, 'error@');
    fireEvent.changeText(inputPassword, '12341234');

    const submitButton = getByText(/entrar/i);

    await waitFor(() => act(() => fireEvent.press(submitButton)));
    expect(mockedShowToast).toHaveBeenCalledTimes(1);
  });

  it('should login render correctly at form error in password field', async () => {
    const mockedShowToast = jest.spyOn(Toast, 'show');

    const {
      render: { getByTestId, getByText }
    } = renderWithCustomProviders(<SignIn />, mockPreloadedStateEmpty);
    const inputEmail = getByTestId(/input-email/i);
    const inputPassword = getByTestId(/input-password/i);

    fireEvent.changeText(inputEmail, 'error@ioasys.com.br');
    fireEvent.changeText(inputPassword, '');

    const submitButton = getByText(/entrar/i);

    await waitFor(() => act(() => fireEvent.press(submitButton)));
    expect(mockedShowToast).toHaveBeenCalledTimes(1);
  });
});
