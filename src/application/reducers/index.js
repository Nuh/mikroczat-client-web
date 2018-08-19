import {combineReducers} from 'redux'
import {sessionReducer as session} from 'redux-react-session';

import profile from './profile';
import client from './client';
import server from './server';
import channels from './channels';
import myChannels from './myChannels';
import messages from './messages';

export default combineReducers({
    session,
    client,
    server,
    profile,
    channels,
    myChannels,
    messages,
});