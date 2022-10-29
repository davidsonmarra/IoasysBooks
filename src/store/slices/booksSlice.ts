import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import BookDTO from '../../@types/BookDTO';
import { CategoryProps } from '../../@types/CategoryProps';

interface Props {
  isEnd: boolean;
  loadingFetchBooks: boolean;
  error: Error | AxiosError;
  booksData: BookDTO[];
  category: CategoryProps;
}

const initialState: Props = {
  isEnd: true,
  loadingFetchBooks: false,
  error: {} as Error | AxiosError,
  booksData: [],
  category: { key: '', title: '' }
};

export interface IFetchBooks {
  offset: number;
  category: CategoryProps;
  search: string;
}

const counterSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    FETCH_BOOKS: (state, { payload }: PayloadAction<IFetchBooks>) => ({
      ...state,
      loadingFetchBooks: true,
      isEnd: false,
      category: payload.category,
      error: {} as Error | AxiosError
    }),
    FETCH_BOOKS_SUCCESS: (state, { payload }: PayloadAction<BookDTO[]>) => ({
      ...state,
      isEnd: payload?.length < 15,
      loadingFetchBooks: false,
      error: {} as Error | AxiosError,
      booksData: state.booksData.concat(payload)
    }),
    FETCH_BOOKS_ERROR: (state, { payload }: PayloadAction<Error | AxiosError>) => ({
      ...state,
      loadingFetchBooks: false,
      error: payload
    }),
    RESET_BOOKS: state => ({
      ...state,
      isEnd: false,
      loadingFetchBooks: false,
      error: {} as Error | AxiosError,
      booksData: [],
      category: { key: '', title: '' },
      search: ''
    })
  }
});

const { actions, reducer } = counterSlice;

export const { FETCH_BOOKS, FETCH_BOOKS_SUCCESS, FETCH_BOOKS_ERROR, RESET_BOOKS } = actions;
export default reducer;
