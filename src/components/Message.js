import * as moment from 'moment';
import React, {Component} from 'react';

import ReactMarkdown from 'react-markdown';

import User from './User';

import './Message.css';
import {connect} from "react-redux";

const markdown = {
    disallowedTypes: ['heading', 'break', 'thematicBreak', 'blockquote', 'linkReference', 'imageReference', 'table', 'tableHead', 'tableBody', 'tableRow', 'tableCell', 'list', 'listItem', 'code', 'html']
};

class Message extends Component {

    voteUp() {
        let {client, data} = this.props;
        client.send('channelmessagevote', {
            channel: data.data.channel,
            type: data.data.type || 'message',
            messageId: data.id,
            sign: 'plus'
        });
    }

    voteDown() {
        let {client, data} = this.props;
        client.send('channelmessagevote', {
            channel: data.data.channel,
            type: data.data.type || 'message',
            messageId: data.id,
            sign: 'minus'
        });
    }

    render() {
        let {data, voteUp, voteDown} = this.props;
        let date = moment(data.created);
        return (
            <div className="message">
                <div className="message--timestamp" title={date.format("dddd, DD MMMM YYYY, HH:mm:ss")}>
                    {date.format('HH:mm:ss')}
                </div>
                <User className="message--user" data={data.author}/>
                <div className="message--message">
                    <ReactMarkdown source={data.data.message} escapeHtml={true} unwrapDisallowed={true}
                                   disallowedTypes={markdown.disallowedTypes}
                                   renderers={{
                                       image: props =>
                                           <a href={props.src} title={props.title || props.src} target="_blank">
                                               <img alt={props.alt || props.src} src={props.src}/>
                                           </a>,
                                       link: props =>
                                           <a href={props.href} title={props.title || props.href} target="_blank">
                                               {!props.children instanceof Array || props.children.length > 0 ? props.children : props.href}
                                           </a>
                                   }}/>
                </div>
                <div className="message--vote">
                    <a className={`message--vote--up ${voteUp ? '' : 'empty'} ${(voteUp || 0) > (voteDown || 0) ? 'dominance' : ''}`}
                       onClick={this.voteUp.bind(this)}>+{voteUp || 0}</a>
                    <a className={`message--vote--down ${voteDown ? '' : 'empty'} ${(voteDown || 0) > (voteUp || 0) ? 'dominance' : ''}`}
                       onClick={this.voteDown.bind(this)}>-{voteDown || 0}</a>
                </div>
            </div>
        );
    }
}

const mapState = ({client}) => {
    return {
        client
    };
};

export default connect(mapState)(Message);