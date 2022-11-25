import { Input } from '../../../src/components';
import { mockPreloadedStateFilled } from '../../../__mocks__';
import {
  matchSnapshotWithProviders,
  fireEvent,
  renderWithCustomProviders,
  cleanup,
  renderHook
} from '../../test-utils';
import { server } from '../../jest.setup';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '../../../src/presentational/SignIn/schema';
import { FieldError, FieldErrorsImpl, useForm } from 'react-hook-form';
import { IFormSignIn } from '../../../src/presentational/SignIn';

const methods = renderHook(() =>
  useForm<IFormSignIn>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onChange'
  })
);
const mockGetValue = jest.fn(() => 'Harry Potter');

const params = (
  name: keyof IFormSignIn = 'email',
  placeholder = '',
  control = methods.result.current.control,
  error: FieldError | undefined = undefined,
  onSubmit = jest.fn(),
  clearErrors = jest.fn(),
  getValue = mockGetValue,
  errors: Partial<FieldErrorsImpl<IFormSignIn>> = {}
) => ({
  name,
  placeholder,
  control,
  error,
  onSubmit,
  clearErrors,
  getValue,
  errors
});

describe('Form Input', () => {
  afterEach(() => {
    cleanup();
    server.resetHandlers();
    mockGetValue.mockReset();
  });

  afterAll(() => server.close());

  it('should match a snapshot', () => {
    matchSnapshotWithProviders(<Input {...params()} />);
  });

  it('should render input correctly', () => {
    const {
      render: { getByTestId }
    } = renderWithCustomProviders(<Input {...params()} />, mockPreloadedStateFilled);
    const input = getByTestId('input-email');
    fireEvent(input, 'onFocus');
    fireEvent(input, 'onBlur');
    expect(mockGetValue.mock.calls).toEqual([['email'], ['email'], ['email']]);
  });

  it('should clear erros works correctly', () => {
    const mockClearErrors = jest.fn();
    const {
      render: { getByTestId }
    } = renderWithCustomProviders(
      <Input
        {...params(
          'email',
          '',
          methods.result.current.control,
          { type: 'required' },
          jest.fn(),
          mockClearErrors,
          mockGetValue,
          {}
        )}
        canClearErrorOnFocus
      />,
      mockPreloadedStateFilled
    );
    const input = getByTestId('input-email');
    fireEvent(input, 'onFocus');

    expect(mockClearErrors.mock.calls).toEqual([['email']]);
  });
});
