import { BookDetails } from '../../src/presentational';
import { mockBook, mockPreloadedStateFilled } from '../../__mocks__';
import {
  matchSnapshotWithProviders,
  fireEvent,
  renderWithCustomProviders,
  cleanup
} from '../test-utils';
import { server } from '../jest.setup';

const mockedUsedGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    goBack: mockedUsedGoBack
  })
}));

describe('Book Details', () => {
  afterEach(() => {
    cleanup();
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it('should match a snapshot', () => {
    matchSnapshotWithProviders(<BookDetails book={mockBook} />);
  });

  it('should go back function be called correctly', () => {
    const {
      render: { getByLabelText }
    } = renderWithCustomProviders(<BookDetails book={mockBook} />, mockPreloadedStateFilled);
    const goBackButton = getByLabelText(/go back/i);

    fireEvent.press(goBackButton);

    expect(mockedUsedGoBack).toHaveBeenCalledTimes(1);
  });
});
