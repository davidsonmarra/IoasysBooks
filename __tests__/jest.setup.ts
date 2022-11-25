import '@testing-library/jest-native/extend-expect';
import 'jest-styled-components';
import 'jest-styled-components/native';
import 'react-native-gesture-handler/jestSetup';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { handlers } from '../__mocks__/handlers';
import { setupServer } from 'msw/lib/node';

jest.useFakeTimers();

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

export const server = setupServer(...handlers);
