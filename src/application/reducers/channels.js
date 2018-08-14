import * as assignIn from 'lodash/assignIn';
import {SESSION_OPENED, getActionType} from '../actions/client';

export default (state = {}, data) => {
    switch (data.type) {
        case SESSION_OPENED:
            data.client.fetch('mychannels');
            data.client.fetch('channellist');
            return state;

        case getActionType('mychannels'):
            assignIn(state, {joined: data.data});
            return state;

        case getActionType('channellist'):
            assignIn(state, {available: data.data});
            return state;

        case getActionType('channeljoin'):
            if (data.data) {
                assignIn(state, {joined: {}});
                state.joined[data.data.name] = data.data;
            }
            return state;

        case getActionType('channelleave'):
            if (data.data) {
                assignIn(state, {joined: {}});
                delete state.joined[data.data];
            }
            return state;

        default:
            return state;
    }
}