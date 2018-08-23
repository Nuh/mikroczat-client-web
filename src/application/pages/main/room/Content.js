import PropTypes from "prop-types";
import React, {Component} from 'react';
import ReactResizeDetector from 'react-resize-detector';
import {CSSTransitionGroup} from 'react-transition-group';
import {connect} from "react-redux";

import {ScrollPanel} from 'primereact/scrollpanel';
import 'primereact/components/scrollpanel/ScrollPanel.css';

import Loading from '../../../../components/Loading';
import Message from '../../../../components/Message';
import Messager from '../../../../components/Messager';

import './Content.css';

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

    componentDidMount() {
        let content = this.getScrollableContentElement();
        if (content) {
            this.scrollToBottom();
        }
    }

    shouldComponentUpdate() {
        this.autoscroll = this.isScrolledToBottom(false);
        return true;
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    getScrollableContentElement() {
        if (this.messagesElement) {
            let {current} = this.messagesElement;
            if (current && current.content) {
                let {content} = current;
                return content;
            }
        }
    }

    isScrolledToBottom(strict) {
        let content = this.getScrollableContentElement();
        if (content) {
            let visibleBottomPosition = content.scrollTop + content.clientHeight;
            return content.scrollHeight - (strict ? 0 : Math.max(content.clientHeight * 0.5, 100)) <= visibleBottomPosition;
        }
    }

    scrollToBottom(force, timeout = 250) {
        const _scrollToBottom = () => {
            let content = this.getScrollableContentElement();
            if (content) {
                content.scrollTop = content.scrollHeight;
            }
        };
        if (this.autoscroll !== false || force) {
            _scrollToBottom()
            if (timeout) {
                setTimeout(_scrollToBottom, timeout);
            }
        }
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
                    <ReactResizeDetector handleWidth handleHeight skipOnMount refreshMode="debounce" refreshRate={75}
                                         onResize={(e) => this.scrollToBottom(false, 0)} />
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