import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import ReactMarkdown from 'react-markdown';

import User from './User';
import Image from './Image';

import './Message.css';

const markdown = {
    disallowedTypes: ['heading', 'break', 'thematicBreak', 'blockquote', 'linkReference', 'imageReference', 'table', 'tableHead', 'tableBody', 'tableRow', 'tableCell', 'list', 'listItem', 'code', 'html']
};

class Message extends Component {
    static propTypes = {
        className: PropTypes.string,
        data: PropTypes.object.isRequired,
        onLoad: PropTypes.func,
        onLoadError: PropTypes.func
    };

    shouldComponentUpdate() {
        return false;
    }

    render() {
        let {children, className, data, onLoad, onLoadError} = this.props;
        let date = moment(data.created);
        return (
            <div className={`${className || ''} message`}>
                <div className="message--timestamp" title={date.format("dddd, DD MMMM YYYY, HH:mm:ss")}>
                    {date.format('HH:mm:ss')}
                </div>
                <User className="message--user" data={data.author}/>
                <div className="message--message">
                    <ReactMarkdown source={data.data.message} escapeHtml={true} unwrapDisallowed={true}
                                   disallowedTypes={markdown.disallowedTypes}
                                   renderers={{
                                       image: props => <Image src={props.src} alt={props.title || props.src}
                                                              animation lightbox onLoad={onLoad}
                                                              onLoadError={onLoadError}/>,
                                       link: props =>
                                           <a href={props.href} title={props.title || props.href} target="_blank">
                                               {!props.children instanceof Array || props.children.length > 0 ? props.children : props.href}
                                           </a>
                                   }}/>
                </div>
                {children}
            </div>
        );
    }
}

export default Message;