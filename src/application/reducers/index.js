import {combineReducers} from 'redux'
import {sessionReducer as session} from 'redux-react-session';
import {connectRouter} from "connected-react-router";
import {persistReducer} from "redux-persist";
import * as storage from "localforage";
import history from "../../store/history";

import profile from './profile';
import client from './client';
import server from './server';
import channels from './channels';
import myChannels from './myChannels';
import messages from './messages';
import settings from './settings';

const persistConfig = {
    key: 'storage',
    storage,
    version: 0,
    whitelist: ['settings', 'server'],
    throttle: 1000
};

export const root = combineReducers({
    session,
    client,
    server,
    profile,
    channels,
    myChannels,
    messages,
    settings
});

export default connectRouter(history)(persistReducer(persistConfig, root));