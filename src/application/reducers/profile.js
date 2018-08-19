import {sessionService} from 'redux-react-session';
import client, {SESSION_OPENED, SESSION_CLOSED, getResponseType} from '../actions/client';

export default (state = null, data) => {
    switch (data.type) {
        case SESSION_OPENED:
            client.fetch('whoiam');
            sessionService.deleteUser();
            return state;

        case SESSION_CLOSED:
            sessionService.deleteUser();
            return state;

        case getResponseType('whoiam'):
            sessionService.saveUser(data.data);
            return state = data.data;

        default:
            return state;
    }
}