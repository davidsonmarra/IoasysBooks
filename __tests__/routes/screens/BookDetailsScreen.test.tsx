import { NavigationContainer } from '@react-navigation/native';
import { BookDetailsScreen } from '../../../src/routes/screens';
import { mockBook, mockPreloadedStateFilled } from '../../../__mocks__';
import { matchSnapshotWithProviders, renderWithCustomProviders } from '../../test-utils';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    params: {
      book: mockBook
    }
  })
}));

describe('Book Details Screen', () => {
  it('should match a snapshot', () => {
    matchSnapshotWithProviders(
      <NavigationContainer>
        <BookDetailsScreen />
      </NavigationContainer>
    );
  });

  it('should go back function be called correctly', () => {
    const {
      render: { getAllByText }
    } = renderWithCustomProviders(
      <NavigationContainer>
        <BookDetailsScreen />
      </NavigationContainer>,
      mockPreloadedStateFilled
    );
    expect(getAllByText(/test title/i)).toBeTruthy();
  });
});
