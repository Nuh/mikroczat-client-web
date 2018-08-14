import * as debounce from 'lodash/debounce';

import {GET_SESSION_SUCCESS, GET_SESSION_ERROR} from 'redux-react-session/dist/actionTypes';
import client, {SESSION_OPENED, SESSION_CLOSED} from '../actions/client';

const connect = debounce(() => client.connect(), 500);

export default (state = null, data) => {
    switch (data.type) {
        case GET_SESSION_SUCCESS:
        case GET_SESSION_ERROR:
            connect();
            return state = client;

        case SESSION_OPENED:
        case SESSION_CLOSED:
            return state = data.client;

        default:
            return state;
    }
}