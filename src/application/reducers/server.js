import * as assignIn from 'lodash/assignIn';
import {SESSION_OPENED, SESSION_CHANGED_STATE, getActionType} from '../actions/client';

export default (state = {}, data) => {
    switch (data.type) {
        case SESSION_OPENED:
            data.client.fetch('version');
            return state;

        case SESSION_CHANGED_STATE:
            return state = assignIn(state, {state: data.client.getStatus()});

        case getActionType('ping'):
            return state = assignIn(state, {latency: data.data});

        case getActionType('version'):
            return state = assignIn(state, data.data);

        default:
            return state;
    }
}