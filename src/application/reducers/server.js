import * as assignIn from 'lodash/assignIn';
import {SESSION_OPENED, SESSION_CHANGED_STATE, getResponseType} from '../actions/client';

export default (state = {}, data) => {
    switch (data.type) {
        case SESSION_OPENED:
            data.client.fetch('version');
            return state;

        case SESSION_CHANGED_STATE:
            return state = assignIn(state, {state: data.client.getStatus()});

        case getResponseType('ping'):
            return state = assignIn(state, {latency: data.data});

        case getResponseType('version'):
            return state = assignIn(state, data.data);

        default:
            return state;
    }
}