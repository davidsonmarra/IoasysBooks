import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import sagas from '../src/store/sagas';
import reducers from '../src/store/slices';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: reducers,
  middleware: [sagaMiddleware]
});

sagaMiddleware.run(sagas);

export type IRootState = ReturnType<typeof reducers>;

export default store;
export { reducers, sagaMiddleware };
