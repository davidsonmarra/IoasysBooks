import BookDTO from '../src/@types/BookDTO';

interface IMockFetchDataBooks {
  data: BookDTO[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export const mockBook: BookDTO = {
  id: '1',
  title: 'Test Title',
  imageUrl: 'https://www.test.com',
  authors: ['Test Author'],
  pageCount: 100,
  publisher: 'Test Publisher',
  published: 1980,
  category: 'Test Category',
  language: 'Test Language',
  isbn10: 'Test ISBN10',
  isbn13: 'Test ISBN13',
  description: 'Test Description'
};

export const mockPreloadedStateEmpty = {
  profile: {
    email: '',
    token: '',
    error: {} as Error,
    isLogged: false,
    isLoading: false
  },
  books: {
    isEnd: false,
    loadingFetchBooks: false,
    error: {} as Error,
    booksData: [],
    category: { key: '', title: '' },
    search: ''
  }
};

export const mockPreloadedStateFilled = {
  profile: {
    email: 'davidson',
    token: 'teste',
    error: {} as Error,
    isLogged: true,
    isLoading: false
  },
  books: {
    isEnd: false,
    loadingFetchBooks: false,
    error: {} as Error,
    booksData: [mockBook],
    category: { key: '', title: '' },
    search: ''
  }
};

export const mockFetchDataBooks: IMockFetchDataBooks = {
  data: [
    {
      ...mockBook,
      id: '2',
      title: 'Harry Potter 1'
    },
    {
      ...mockBook,
      id: '3',
      title: 'Harry Potter 2'
    },
    {
      ...mockBook,
      id: '4',
      title: 'Harry Potter 3'
    },
    {
      ...mockBook,
      id: '5',
      title: 'Harry Potter 4'
    },
    {
      ...mockBook,
      id: '6',
      title: 'Harry Potter 5'
    }
  ],
  page: 1,
  totalPages: 1,
  totalItems: 2
};
