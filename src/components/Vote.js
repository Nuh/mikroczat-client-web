import * as isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './Vote.css';
import {connect} from "react-redux";

class Vote extends Component {
    static propTypes = {
        message: PropTypes.object.isRequired
    };

    voteUp() {
        let {client, message} = this.props;
        client.send('channelmessagevote', {
            channel: message.data.channel,
            type: message.data.type || 'message',
            messageId: message.id,
            sign: 'plus'
        });
    }

    voteDown() {
        let {client, message} = this.props;
        client.send('channelmessagevote', {
            channel: message.data.channel,
            type: message.data.type || 'message',
            messageId: message.id,
            sign: 'minus'
        });
    }

    shouldComponentUpdate(nextProps) {
        return !isEqual(this.props.voteUp, nextProps.voteUp) || !isEqual(this.props.voteDown, nextProps.voteDown);
    }

    render() {
        let {className, voteUp, voteDown} = this.props;
        return (
            <div className={`${className || ''} vote`}>
                <a className={`vote--up ${voteUp ? '' : 'empty'} ${(voteUp || 0) > (voteDown || 0) ? 'dominance' : ''}`}
                   onClick={this.voteUp.bind(this)}>+{voteUp || 0}</a>
                <a className={`vote--down ${voteDown ? '' : 'empty'} ${(voteDown || 0) > (voteUp || 0) ? 'dominance' : ''}`}
                   onClick={this.voteDown.bind(this)}>-{voteDown || 0}</a>
            </div>
        );
    }
}

const mapState = ({client}, {message}) => {
    return {
        client,
        voteUp: ((message || {}).vote || {})['plus'] || 0,
        voteDown: ((message || {}).vote || {})['minus'] || 0,
    };
};

export default connect(mapState)(Vote);