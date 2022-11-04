import '@testing-library/jest-native/extend-expect';
import 'jest-styled-components';
import 'jest-styled-components/native';
import 'react-native-gesture-handler/jestSetup';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.useFakeTimers();

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// jest.mock('@react-navigation/native', () => {
//   const originalModule = jest.requireActual('@react-navigation/native');

//   return {
//     __esModule: true,
//     ...originalModule,
//     useFocusEffect: jest.fn(),
//     useNavigation: jest.fn(() => ({
//       dangerouslyGetParent: jest.fn(),
//       navigate: jest.fn(),
//       goBack: jest.fn()
//     })),
//     useRoute: () => ({
//       params: {
//         selectedEstablishment: jest.fn(),
//         registeredEstablishment: jest.fn()
//       },
//       name: ''
//     }),
//     useIsFocused: jest.fn()
//   };
// });
