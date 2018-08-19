import * as isEqual from 'lodash/isEqual';
import {sessionService} from 'redux-react-session';

import Client from "../../api/client";
import configuration from "../../configuration";
import store from '../../store';

const SERVER_PREFIX = '@@mikroczat-client/CLIENT_RECEIVED_';
export const SESSION_OPENED = '@@mikroczat-client/CLIENT_OPENED';
export const SESSION_CLOSED = '@@mikroczat-client/CLIENT_CLOSED';
export const SESSION_CHANGED_STATE = '@@mikroczat-client/CLIENT_STATE_CHANGED';
export const getResponseType = (type) => `${SERVER_PREFIX}RESPONSE_${type.toUpperCase()}`;
export const getActionType = (type) => `${SERVER_PREFIX}ACTION_${type.toUpperCase()}`;

class ApplicationClient extends Client {

    constructor() {
        super();

        this.on('ping', (latency) => store.dispatch({
            type: getResponseType('ping'),
            client: this,
            data: latency
        }));

        this.on('action', (data) => data && store.dispatch({
            type: getActionType(data.type || 'unknown'),
            client: this,
            data: data
        }));
    }

    async connect() {
        sessionService
            .loadSession()
            .then((session) => this._connect(session), () => this._connect())
    }

    async _connect(session) {
        let changedSession = !isEqual(this.session, session);
        if (!changedSession && this.getStatus() === 1) {
            return this;
        }

        await this.disconnect();

        this.once('open', () => {
            if (this.channels) {
                this.channels.forEach((ch) => {
                    this.join(ch);
                });
            }
            store.dispatch({type: SESSION_OPENED, client: this});
            store.dispatch({type: SESSION_CHANGED_STATE, client: this});
            if (!this._intervalChannelList) {
                this._intervalChannelList = setInterval(() => {
                    this.fetch('channellist');
                }, 15000);
            }
        });
        this.once('close', () => {
            this.channelName = null;
        });
        this.once('error', () => {
            this.channelName = null;
            this._tryReconnect = (this._tryReconnect || 0) + 1;
            if (this._tryReconnect < 10) {
                setTimeout(() => this._connect(session), 6000);
            }
        });
        store.dispatch({type: SESSION_CHANGED_STATE, client: this});
        return await super.connect(configuration.server.websocket, this.session = session);
    }

    async disconnect(reason) {
        this.once('close', () => {
            if (this._intervalChannelList) {
                this._intervalChannelList = clearInterval(this._intervalChannelList);
            }
            store.dispatch({type: SESSION_CLOSED, client: this});
            store.dispatch({type: SESSION_CHANGED_STATE, client: this});
        });
        store.dispatch({type: SESSION_CHANGED_STATE, client: this});
        return await super.disconnect();
    }

    join(name) {
        let changedChannel = !isEqual(this.channelName, name);
        if (!changedChannel || !name) {
            return this;
        }
        if (this.channelName) {
            this.fetch('channelleave', {name: this.channelName});
        }
        this.fetch('channeljoin', {name: this.channelName = name});
        this.channels = [...(new Set([...(this.channels || []), name]))];
        return this;
    }

    fetch(type, data = null) {
        return this.send(type, data, (response) => {
            store.dispatch({
                type: getResponseType(type),
                client: this,
                response: response,
                data: response && response.result ? response.data : null
            });
        });
    }
}

export const client = new ApplicationClient();
export default client;