import {getActionType} from '../actions/client';

export default (state = {}, data) => {
    switch (data.type) {
        case getActionType('channelaction'):
            let {channel} = data.data.data;
            if (channel) {
                state[channel] = [...(state[channel] || []), data.data];
            }
            return state;

        default:
            return state;
    }
}