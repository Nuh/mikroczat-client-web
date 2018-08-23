import {getActionType} from '../actions/client';

export default (state = {}, data) => {
    switch (data.type) {
        case getActionType('channelaction'): {
            let {channel} = data.data.data;
            if (channel) {
                state[channel] = [...(state[channel] || []), data.data].splice(-1000);
            }
            return state;
        }

        case getActionType('channelmessagevote'): {
            let {channel, messageId, sign} = data.data.data;
            if (channel) {
                let msg = state[channel].find((msg) => msg.id === messageId);
                if (msg) {
                    msg.vote = msg.vote || {plus: 0, minus: 0};
                    msg.vote[sign || 'plus'] = (msg.vote[sign || 'plus'] || 0) + 1;
                    return {...state};
                }
            }
            return state;
        }

        default:
            return state;
    }
}