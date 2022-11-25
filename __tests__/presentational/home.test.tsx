import { Home } from '../../src/presentational';
import { mockBook, mockFetchDataBooks, mockPreloadedStateFilled } from '../../__mocks__';
import {
  matchSnapshotWithProviders,
  fireEvent,
  renderWithCustomProviders,
  act,
  waitFor,
  cleanup
} from '../test-utils';
import { server } from '../jest.setup';

const mockedUsedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockedUsedNavigate
  })
}));

describe('Home', () => {
  afterEach(() => {
    cleanup();
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it('should match a snapshot', () => {
    matchSnapshotWithProviders(<Home />);
  });

  it('should logout function be called correctly', () => {
    const {
      render: { getByLabelText },
      store
    } = renderWithCustomProviders(<Home />, mockPreloadedStateFilled);
    const logoutButton = getByLabelText(/logout/i);
    expect(store.getState().profile.email).toBeTruthy();

    fireEvent.press(logoutButton);

    expect(store.getState().profile.email).toBeFalsy();
  });

  it('should search for a book and clear search', async () => {
    server.listen();
    const {
      render: { getByPlaceholderText, getByTestId },
      store
    } = renderWithCustomProviders(<Home />, mockPreloadedStateFilled);
    const searchInput = getByPlaceholderText(/procure um livro/i);
    const searchSubmitButton = getByTestId(/search-submit-button/i);
    fireEvent.changeText(searchInput, 'harry potter');

    await waitFor(() => act(() => fireEvent.press(searchSubmitButton)));
    expect(store.getState().books.booksData).toEqual(mockFetchDataBooks.data);

    expect(searchInput.props.value).toEqual('harry potter');
    await waitFor(() => act(() => fireEvent.press(searchSubmitButton)));
    expect(searchInput.props.value).toBeFalsy();
  });

  it('should call onEndReached correctly', async () => {
    const {
      render: { getByTestId },
      store
    } = renderWithCustomProviders(<Home />, mockPreloadedStateFilled);
    server.listen();
    const booksFlatlist = getByTestId(/books-flatlist/i);

    await waitFor(() => act(() => fireEvent(booksFlatlist, 'onEndReached')));
    expect(store.getState().books.isEnd).toBeTruthy();

    await waitFor(() => act(() => fireEvent(booksFlatlist, 'onEndReached')));
  });

  it('should navigate to book details screen', () => {
    const {
      render: { getByTestId }
    } = renderWithCustomProviders(<Home />, mockPreloadedStateFilled);
    const book = getByTestId(/book-item-on-flatlist/i);
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
    fireEvent.press(book);
    expect(mockedUsedNavigate).toHaveBeenCalledWith('BookDetailsScreen', { book: mockBook });
  });

  it('should filter modal works correctly', () => {
    const {
      render: { getByLabelText, getByTestId }
    } = renderWithCustomProviders(<Home />, mockPreloadedStateFilled);
    const filterButton = getByLabelText(/filtros/i);
    const filterModal = getByTestId(/filter-modal/i);

    expect(filterModal.props.visible).toBeFalsy();
    fireEvent.press(filterButton);
    expect(filterModal.props.visible).toBeTruthy();
  });

  it('should work correctly on api error', async () => {
    server.listen();
    const {
      render: { getByPlaceholderText, getByTestId },
      store
    } = renderWithCustomProviders(<Home />, {
      ...mockPreloadedStateFilled,
      books: { ...mockPreloadedStateFilled.books, booksData: [{ ...mockBook, title: 'error' }] }
    });
    const searchInput = getByPlaceholderText(/procure um livro/i);
    const searchSubmitButton = getByTestId(/search-submit-button/i);
    fireEvent.changeText(searchInput, 'error');

    expect(store.getState().books.error).toStrictEqual({});
    await waitFor(() => act(() => fireEvent.press(searchSubmitButton)));

    expect(store.getState().books.error.name).toStrictEqual('AxiosError');
  });
});
