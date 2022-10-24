import { all } from 'redux-saga/effects';

import loginSaga from './profileSaga';
import booksSaga from './booksSaga';

function* rootSaga() {
  yield all([loginSaga(), booksSaga()]);
}

export default rootSaga;
