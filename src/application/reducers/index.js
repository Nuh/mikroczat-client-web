import {combineReducers} from 'redux'
import {sessionReducer as session} from 'redux-react-session';

import client from './client';
import server from './server';
import channels from './channels';

export default combineReducers({
    session,
    client,
    server,
    channels
});