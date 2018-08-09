import * as partial from 'lodash/partial';
import * as reduceRight from 'lodash/reduceRight';
import {applyMiddleware, compose, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {connectRouter, routerMiddleware} from 'connected-react-router';
import {persistReducer} from 'redux-persist';
import * as storage from 'localforage';
import reducers from '../reducers';
import history from './history';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Combine application's reducers and infrastructure's reducers
const combinedReducers = reduceRight([
    partial(persistReducer, {key: 'storage', storage, blacklist: ['session', 'router']}),
    connectRouter(history),
    reducers
], (root, reducer) => root = reducer(root));

// Initalize store
const store = createStore(combinedReducers, undefined,
    composeEnhancer(applyMiddleware(thunkMiddleware, routerMiddleware(history)))
);

export default store;