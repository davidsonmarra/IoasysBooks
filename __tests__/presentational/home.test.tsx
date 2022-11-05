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
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { FETCH_BOOKS_SUCCESS, FETCH_BOOKS_ERROR } from '../../src/store/slices/booksSlice';

const server = setupServer(
  rest.get('https://books.ioasys.com.br/api/v1/books', (req, res, ctx) => {
    const search: string = req.url.searchParams.get('title') || '';
    return search.includes('error')
      ? res(ctx.status(401), ctx.json(mockFetchDataBooks))
      : res(
          ctx.json({
            errorMessage: `Error 401`
          })
        );
  })
);

jest.mock('redux-saga/effects', () => ({
  ...jest.requireActual('redux-saga/effects'),
  put: jest.fn()
}));

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
    act(() => store.dispatch(FETCH_BOOKS_SUCCESS(mockFetchDataBooks.data)));

    expect(store.getState().books.booksData).toEqual(mockFetchDataBooks.data);

    await waitFor(() => {
      act(() => fireEvent.press(searchSubmitButton));
      act(() => store.dispatch(FETCH_BOOKS_SUCCESS([mockBook])));
    });

    expect(store.getState().books.booksData).toEqual([mockBook]);
  });

  it('should call onEndReached correctly', () => {
    const {
      render: { getByTestId },
      store
    } = renderWithCustomProviders(<Home />, mockPreloadedStateFilled);
    const booksFlatlist = getByTestId(/books-flatlist/i);

    fireEvent(booksFlatlist, 'onEndReached');
    act(() => store.dispatch(FETCH_BOOKS_SUCCESS([])));
    fireEvent(booksFlatlist, 'onEndReached');

    expect(store.getState().books.isEnd).toBeTruthy();
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

  it('should work correctly on 401 error', async () => {
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
    act(() => store.dispatch(FETCH_BOOKS_ERROR(new Error('message'))));
    expect(store.getState().books.error).toStrictEqual(Error('message'));
  });
});
