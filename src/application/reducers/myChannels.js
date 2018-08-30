import * as clone from 'lodash/clone';
import * as find from 'lodash/find';
import * as sortBy from 'lodash/sortBy';
import * as remove from 'lodash/remove';
import {getActionType, getResponseType, SESSION_OPENED} from '../actions/client';

const sortUsers = (users) => sortBy(
    [...(new Set(users || []))],
    [user => user.username.toLowerCase()],
    ['username', 'type']
);

const sortChannels = (state) => sortBy(
    [...(new Set(state || []))],
    [ch => ch.name.toLowerCase()],
    ['name', 'type']
);

const refreshChannel = (oldState, channel) => {
    remove(oldState, (ch) => ch === channel);
    return sortChannels([...oldState, clone(channel)]);
};

export default (state = [], data) => {
    switch (data.type) {
        case SESSION_OPENED:
            data.client.fetch('mychannels');
            return state;

        case getResponseType('mychannels'):
            return state = data.data || [];

        case getResponseType('channeljoin'):
            if (data.data) {
                data.data.users = sortUsers(data.data.users);
                state = sortChannels([...(state || []), data.data]);
            }
            return state;

        case getResponseType('channelleave'):
            if (state && data.data) {
                let channel = data.data;
                remove(state, (ch) => ch && ch.type && ch.type === channel.type && ch.name && ch.name === channel.name)
            }
            return state;

        case getActionType('channeljoin'):
            if (data.data && data.data.author) {
                let user = data.data.author;
                let channel = find(state, (ch) => ch && ch.name && ch.name === data.data.data.name);
                if (channel) {
                    channel.users = sortUsers([...(channel.users || []), user]);
                    return refreshChannel(state, channel);
                }
            }
            return state;

        case getActionType('channelleave'):
            if (data.data && data.data.author) {
                let user = data.data.author;
                let channel = find(state, (ch) => ch && ch.name && ch.name === data.data.data.name);
                if (channel && channel.users) {
                    if (remove(channel.users, (u) => u && u.type && u.type === user.type && u.username && u.username === user.username)) {
                        return refreshChannel(state, channel);
                    }
                }
            }
            return state;

        case getActionType('channelproperty'):
            if (data.data && data.data.author) {
                let channel = find(state, (ch) => ch && ch.name && ch.name === data.data.data.channel.name);
                if (channel) {
                    channel.properties = clone(channel.properties || {});
                    channel.properties[data.data.data.key] = data.data.data.value;
                    return refreshChannel(state, channel);
                }
            }
            return state;

        default:
            return state;
    }
}