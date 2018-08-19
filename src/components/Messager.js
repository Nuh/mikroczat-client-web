import React, {Component} from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSmile, faArrowCircleRight} from "@fortawesome/free-solid-svg-icons";

import './Messager.css';
import {connect} from "react-redux";

class Messager extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            message: ''
        }
    }

    handleChange(event) {
        this.setState({message: event.target.value})
    }

    handleSubmit(event) {
        event.preventDefault();
        let {message} = this.state;
        let {client, channel} = this.props;
        this.setState({message: ''});
        if (channel && ((message || '').toString() || '').trim()) {
            if (message.startsWith('/')) {
                let [command, ...args] = message.trim().split(/[ ]+/i);
                switch (command.toLowerCase()) {
                    case '/topic':
                        return client.send('channelproperty', {
                            channel: channel.name,
                            key: 'topic',
                            value: args.join(' ').trim()
                        });

                    case '/embed':
                        return client.send('channelproperty', {
                            channel: channel.name,
                            key: 'embed',
                            value: args[0]
                        });

                    case '/me':
                        return client.send('channelaction', {
                            channel: channel.name,
                            type: 'me',
                            message: args.join(' ').trim()
                        });

                    default:
                        console.error('Unknown command')
                }
            } else {
                client.send('channelaction', {
                    channel: channel.name,
                    type: 'message',
                    message: message.trim()});
            }
        }
    }

    render() {
        return (
            <form className="messager" onSubmit={this.handleSubmit.bind(this)}>
                <div className="messager--options">
                    <a onClick={e => console.log('todo...')}>
                        <FontAwesomeIcon icon={faSmile} transform="right-2 down-2"/>
                    </a>
                </div>
                <input placeholder="Message...." type="text" value={this.state.message}
                       onChange={this.handleChange.bind(this)}/>
                <div className="messager--options-right">
                    <button type="submit">
                        <FontAwesomeIcon icon={faArrowCircleRight} transform="left-2 down-2"/>
                    </button>
                </div>
            </form>
        );
    }
}

const mapState = ({client}) => {
    return {
        client
    };
};

export default connect(mapState)(Messager);