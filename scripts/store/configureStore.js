import {createStore, applyMiddleware} from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/index';
import createSagaMiddleware from 'redux-saga'
import saga from '../sagas'

const logger = createLogger({collapsed: true});
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, createSagaMiddleware(saga), logger)(createStore);

export default function configureStore(initialState) {
    const store = createStoreWithMiddleware(rootReducer, initialState);

    return store;
}
