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
                                               {props.alt ? (
                                                   <img alt={props.alt} src={props.src}/>
                                               ) : (
                                                   <img src={props.src}/>
                                               )}
                                           </a>,
                                       link: props =>
                                           <a href={props.href} title={props.title || props.href} target="_blank">
                                               {!props.children instanceof Array || props.children.length > 0 ? props.children : props.href}
                                           </a>
                                   }}/>
                </div>
            </div>
        );
    }
}

export default Message;