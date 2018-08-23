import PropTypes from "prop-types";
import React, {Component} from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

import {ScrollPanel} from 'primereact/scrollpanel';
import 'primereact/components/scrollpanel/ScrollPanel.css';

import Loading from '../../../../components/Loading';
import Message from '../../../../components/Message';
import Messager from '../../../../components/Messager';

import './Content.css';
import {connect} from "react-redux";

class RoomContent extends Component {
    static contextTypes = {store: PropTypes.object};
    static propTypes = {
        content: PropTypes.object,
        messages: PropTypes.array
    };

    constructor(props, context) {
        super(props, context);
        this.messagesElement = React.createRef();
    }

    shouldComponentUpdate() {
        this.autoscroll = this.isScrolledToBottom();
        return true;
    }

    componentDidUpdate() {
        if (this.autoscroll) {
            this.scrollToBottom();
        }
    }

    isScrolledToBottom() {
        if (this.messagesElement) {
            let {current} = this.messagesElement;
            if (current && current.content) {
                let {content} = current;
                return content.scrollHeight <= content.scrollTop + content.clientHeight;
            }
        }
        return true;
    }

    scrollToBottom() {
        setTimeout(() => {
            if (this.messagesElement) {
                let {current} = this.messagesElement;
                if (current && current.content) {
                    let {content} = current;
                    content.scrollTop = content.scrollHeight - content.clientHeight;
                }
            }
        }, 100);
    }

    render() {
        let {content, messages} = this.props;
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
                    {messages && messages.map((msg, index) => <Message key={index} data={msg}/>)}
                </ScrollPanel>
                <CSSTransitionGroup transitionEnterTimeout={0} transitionLeaveTimeout={500}
                                    transitionName="animation-hide">
                    {!messages && (
                        <Loading showIcon={false} description={[
                            "Don't be shy! Write something :)",
                            "Oh, look! Still no one writes... :(",
                            "Say hello!"
                        ]}/>
                    )}
                </CSSTransitionGroup>
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