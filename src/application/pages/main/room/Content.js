import PropTypes from "prop-types";
import React, {Component} from 'react';

import {ScrollPanel} from 'primereact/scrollpanel';
import 'primereact/components/scrollpanel/ScrollPanel.css';

import Loading from '../../../../components/Loading';
import Message from '../../../../components/Message';
import Messager from '../../../../components/Messager';


import './Content.css';
import {connect} from "react-redux";

class RoomContent extends Component {
    static contextTypes = {store: PropTypes.object};
    static propTypes = {content: PropTypes.object};

    constructor(props, context) {
        super(props, context);
        this.messagesElement = React.createRef();
    }

    scrollToBottom() {
        setTimeout(() => {
            if (this.messagesElement) {
                let {current} = this.messagesElement;
                if (current && current.content) {
                    let {content} = current;
                    let differentPixels = content.scrollHeight - (content.scrollTop + content.clientHeight);
                    if (differentPixels <= 100) {
                        content.scrollTop = content.scrollHeight - content.clientHeight;
                    }
                }
            }
        }, 0);
    }

    render() {
        let {content, messages} = this.props;
        this.scrollToBottom();
        return (
            <div className="room-content">
                <div id="room-tray" className="room-content--title">
                    {this.props.children && (
                        <span className="room-content--title-options">
                            {this.props.children}
                        </span>
                    )}
                    <span className="room-content--title-name">#{content.name}</span>
                    {content.properties.topic && (
                        <span className="room-content--title-topic" title={content.properties.topic}>
                            {content.properties.topic}
                        </span>
                    )}
                </div>
                <ScrollPanel ref={this.messagesElement} className="room-content--messages">
                    {messages ? messages.map((msg, index) => (
                        <Message key={index} data={msg}/>
                    )) : (
                        <Loading showIcon={false}>
                            Don't be shy! Write something down :)
                        </Loading>
                    )}
                </ScrollPanel>
                <Messager className="room-content--input" channel={content}/>
            </div>
        );
    }
}

const mapState = ({messages}, {content}) => {
    let {name} = content;
    return {
        messages: messages[name]
    };
};

export default connect(mapState)(RoomContent);