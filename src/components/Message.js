import * as moment from 'moment';
import React, {Component} from 'react';

import ReactMarkdown from 'react-markdown';

import User from './User';

import './Message.css';

const markdown = {
    disallowedTypes: ['heading', 'break', 'thematicBreak', 'blockquote', 'linkReference', 'imageReference', 'table', 'tableHead', 'tableBody', 'tableRow', 'tableCell', 'list', 'listItem', 'code', 'html']
};

class Message extends Component {
    render() {
        let {data} = this.props;
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
                                               {props.children}
                                           </a>
                                   }}/>
                </div>
            </div>
        );
    }
}

export default Message;