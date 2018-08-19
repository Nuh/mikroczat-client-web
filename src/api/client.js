import * as once from 'lodash/once';
import {EventEmitter2} from 'eventemitter2';
import * as WebSocket from 'isomorphic-ws';
import uuid from 'uuid';
import * as URI from 'urijs';

let getUrl = (url, params) => {
    let uri = URI(url);
    if (url) {
        uri.protocol(uri.protocol() || 'ws');
    } else {
        uri.href(window.location.href);
        uri.subdomain('server');
        uri.protocol(uri.protocol() === 'https' ? 'wss' : 'ws');
        uri.path('');
    }
    if (params instanceof Object) {
        uri.addQuery(params);
    }
    uri.normalize();
    return uri.href();
};

export default class Client extends EventEmitter2 {
    constructor() {
        super({
            newListener: false,
            maxListeners: 20
        });
        this._socket = null;
        this._messages = {};
        this.latency = null;
    }

    async connect(server, params) {
        let handlerMessages = (socket) => (str) => {
            if (str && str instanceof Object && str.data) {
                str = str.data;
            }
            if (!str || !str.toString()) {
                return;
            }
            try {
                let data = JSON.parse(str);
                if (data.request) {
                    let message = this._messages[data.id];
                    message._reply(data);
                } else {
                    this.emit('action', data, this, socket);
                }
            } catch (e) {
                console.error('Failed parse message:', str, e);
            }
        }, handleError = (socket) => once(async (e) => {
            this.emit('error', e, this, socket);
            await this.disconnect();
        }), handlerClose = (socket) => once((e) => {
            if (this._intervalPing) {
                this._intervalPing = clearInterval(this._intervalPing);
            }
            socket.onclose = null;
            socket.onerror = null;
            socket.onmessage = null;
            this.emit('close', this, socket, e);
        }), handlerOpen = (socket) => once((e) => {
            socket.onopen = null;
            socket.onclose = handlerClose(socket);
            socket.onerror = handleError(socket);
            socket.onmessage = handlerMessages(socket);
            this.emit('open', this, socket, e);
            if (!this._intervalPing) {
                this._intervalPing = setInterval(() => {
                    let message = this.send('ping', null, () => {
                        let evaluateTime = message.response.created - message.message.received;
                        this.latency = Math.round(((message.response.received - message.sent) - evaluateTime) / 2.0);
                        this.emit('ping', this.latency, this, socket);
                    })
                }, 15000);
            }
        });
        if (!this._socket || this.getStatus() >= 2) {
            let url = getUrl(server, params);
            if (url) {
                this._socket = new WebSocket(url);
                this._socket.onerror = handleError(this._socket);
                this._socket.onopen = handlerOpen(this._socket);
            }
        }
        return this;
    };

    async disconnect() {
        if (this._socket) {
            let socket = this._socket;
            this._socket = null;
            socket.close();
        }
        return this;
    };

    getStatus() {
        return (this._socket ? this._socket.readyState : null) || 0;
    }

    send(type, data, callback) {
        let message = new ClientMessage(this, type, data, callback);
        this._messages[message.message.id] = message;
        return message._send();
    }
}

export const ClientMessageStatus = {
    PENDING: Symbol('PENDING'),
    SENDING: Symbol('SENDING'),
    SENT: Symbol('SENT'),
    QUEUED: Symbol('QUEUED'),
    CLOSED: Symbol('CLOSED')
};

class ClientMessage {
    constructor(client, type, data, callback) {
        this._client = client;
        this._callback = callback;
        this.message = {
            id: uuid.v4(),
            type: type,
            data: data,
            created: (new Date()).getTime(),
            received: null
        };
        this.response = null;
        this.status = ClientMessageStatus.PENDING;
        this.sent = null;
    }

    _send() {
        let _realSend = () => {
            if (this._client._socket) {
                this._client._socket.send(JSON.stringify(this.message));
                this.status = ClientMessageStatus.SENT;
                this.sent = (new Date()).getTime();
            }
        };
        setTimeout(() => {
            if (!this.status || this.status === ClientMessageStatus.PENDING) {
                this.status = ClientMessageStatus.SENDING;
                if (this._client.getStatus() === 1) {
                    _realSend();
                } else {
                    this.status = ClientMessageStatus.QUEUED;
                    this._client.once('open', () => _realSend());
                }
            }
        }, 0);
        return this;
    }

    _reply(response) {
        if (this.status === ClientMessageStatus.SENT) {
            let id = this.message.id;
            if (response && response.id === id) {
                if (this._client && this._client._messages && this._client._messages[id] === this) {
                    delete this._client._messages[id];
                }
                delete this._client;
                this.status = ClientMessageStatus.CLOSED;
                this.response = {
                    result: response.result || false,
                    data: response.data || null,
                    created: response.created || (new Date()).getTime(),
                    received: (new Date()).getTime()
                };
                this.message.received = response.request.created;
                let callback = this._callback;
                if (callback instanceof Function) {
                    delete this._callback;
                    callback(this.response, this);
                }
            }
        }
        return this;
    }
}