import {applyMiddleware, compose, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {routerMiddleware} from 'connected-react-router';
import reducers from '../application/reducers';
import history from './history';

const composeEnhancer = compose; //window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Initalize store
export const store = createStore(reducers, undefined,
    composeEnhancer(applyMiddleware(thunkMiddleware, routerMiddleware(history)))
);

export default store;