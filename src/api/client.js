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
    }

    connect(server, params) {
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
                    this.emit('action', data);
                }
            } catch (e) {
                console.error('Failed parse message:', str, e);
            }
        }, handlerClose = (socket) => () => {
            if (this._socket === socket) {
                this._socket = null;
                this.emit('close', this);
            }
        }, handlerOpen = (socket) => () => {
            socket.onopen = null;
            socket.onclose = handlerClose(socket);
            socket.onmessage = handlerMessages(socket);
            this.emit('open', this);
        };
        if (!this._socket || this.getStatus() >= 2) {
            this.disconnect();
            let url = getUrl(server, params);
            if (url) {
                this._socket = new WebSocket(url);
                this._socket.onopen = handlerOpen(this._socket);
            }
        }
    };

    disconnect(reason) {
        if (!this._socket) {
            return;
        }
        if (this.getStatus() < 2) {
            this._socket.close(4000, reason);
        } else {
            if (this.getStatus() === 2) {
                this._socket.terminate();
            }
            this._socket = null;
        }
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
            created: (new Date()).getTime()
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
        if (!this.status || this.status === ClientMessageStatus.PENDING) {
            this.status = ClientMessageStatus.SENDING;
            if (this._client.getStatus() === 1) {
                _realSend();
            } else {
                this.status = ClientMessageStatus.QUEUED;
                this._client.once('open', () => _realSend());
            }
        }
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