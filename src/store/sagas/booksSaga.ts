import { all, call, put, takeLatest } from 'redux-saga/effects';
import api from '../../services/api';
import { FETCH_BOOKS, FETCH_BOOKS_SUCCESS, FETCH_BOOKS_ERROR } from '../slices/booksSlice';

function* fetchBooks({ payload: { offset, category, search } }: ReturnType<typeof FETCH_BOOKS>) {
  const searchQuery = `/books?page=${offset}&amount=15&category=${category.key}&title=${search}`;
  try {
    const { data } = yield call(api.get, searchQuery);
    yield put(FETCH_BOOKS_SUCCESS(data?.data));
  } catch (err: any) {
    /* eslint no-console: [0] */
    console.log(err.response.data.errors.message);
    yield put(FETCH_BOOKS_ERROR(err.response.data.errors.message));
  }
}

export default function* watcher() {
  yield all([takeLatest(FETCH_BOOKS, fetchBooks)]);
}
