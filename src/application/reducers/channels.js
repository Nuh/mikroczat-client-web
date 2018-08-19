import {getResponseType, SESSION_OPENED} from '../actions/client';

export default (state = [], data) => {
        switch (data.type) {
        case SESSION_OPENED:
            data.client.fetch('channellist');
            return state;

        case getResponseType('channellist'):
            return state = data.data || [];

        default:
            return state;
    }
}