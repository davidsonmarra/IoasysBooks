import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import reducers from '../src/store/slices';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: reducers,
  middleware: [sagaMiddleware]
});

export type IRootState = ReturnType<typeof reducers>;

export default store;
export { reducers, sagaMiddleware };
