import * as debounce from 'lodash/debounce';
import PropTypes from "prop-types";
import React, {Component} from 'react';
import ReactResizeDetector from 'react-resize-detector';
import {CSSTransitionGroup} from 'react-transition-group';
import {connect} from "react-redux";
import {Helmet} from 'react-helmet';
import IdleTimer from 'react-idle-timer';

import {ScrollPanel} from 'primereact/scrollpanel';
import 'primereact/components/scrollpanel/ScrollPanel.css';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowCircleDown} from '@fortawesome/free-solid-svg-icons'

import Loading from '../../../../components/Loading';
import Vote from '../../../../components/Vote';
import Message from '../../../../components/Message';
import Messager from '../../../../components/Messager';

import './Content.css';

class RoomContent extends Component {
    static contextTypes = {store: PropTypes.object};
    static propTypes = {
        content: PropTypes.object.isRequired,
        profile: PropTypes.object,
        messages: PropTypes.array
    };

    constructor(props, context) {
        super(props, context);
        this.messagesElement = React.createRef();
        this._handleScroll = debounce(this._handleScroll.bind(this), 100, {leading: true, trailing: true});
    }

    componentDidMount() {
        let content = this.getScrollableContentElement();
        if (content) {
            this.scrollToBottom();
            content.addEventListener('scroll', this._handleScroll);
        }
    }

    shouldComponentUpdate() {
        if (!this.autoscroll && this.isScrolledToBottom()) {
            this.autoscroll = true;
        }
        return true;
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    componentWillUnmount() {
        let content = this.getScrollableContentElement();
        if (content) {
            content.removeEventListener('scroll', this._handleScroll);
        }
    }

    _handleScroll(e) {
        let {target} = e;
        if (target) {
            if (target.scrollTop < this._lastScrollTop) {
                if (this.autoscroll) {
                    this.idleTimer && this.idleTimer.pause();
                    this.lastVisibileMessages = (new Date()).getTime();
                    this.autoscroll = false;
                }
            } else if (this.isScrolledToBottom()) {
                this.autoscroll = true;
                this.lastVisibileMessages = null;
            }
            this._lastScrollTop = target.scrollTop;
        }
    }

    isUnreadMessage(message) {
        let {profile} = this.props;
        if (this.idleTimer && message) {
            return (profile.type !== message.author.type || profile.username !== message.author.username) && message.created > (this.lastVisibileMessages || this.idleTimer.getLastActiveTime());
        }
    }

    hasUnreadMessages() {
        let {messages} = this.props;
        if (messages && messages.length && this.idleTimer) {
            let newestMessage = messages[messages.length - 1];
            return this.isUnreadMessage(newestMessage);
        }
    }

    getUnreadMessages() {
        let {messages} = this.props;
        if (messages && messages.length) {
            return messages.filter((msg) => this.isUnreadMessage(msg)) || [];
        }
        return [];
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

    isScrolledToBottom() {
        let content = this.getScrollableContentElement();
        if (content) {
            let visibleBottomPosition = content.scrollTop + content.clientHeight;
            return (content.scrollHeight - 50) <= visibleBottomPosition;
        }
    }

    scrollToBottom(force, timeout = 0) {
        const _scrollToBottom = () => {
            if (this.autoscroll !== false || force) {
                let content = this.getScrollableContentElement();
                if (content) {
                    content.scrollTop = content.scrollHeight;
                }
            }
        };
        this.idleTimer && this.idleTimer.resume();
        _scrollToBottom();
        if (timeout) {
            setTimeout(_scrollToBottom, timeout);
        }
    }

    render() {
        let {content, messages} = this.props;
        return (
            <div className="room-content">
                <Helmet>
                    <title>{`${this.hasUnreadMessages() ? `(${this.getUnreadMessages().length}) ` : ''}#${content.name}`}</title>
                    <link rel="shortcut icon" type="image/ico"
                          href={this.hasUnreadMessages() ? "/favicon-unread.ico" : "/favicon.ico"}/>
                </Helmet>
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
                                         onResize={() => this.scrollToBottom(false, 0)}/>
                    <IdleTimer element={document} ref={ref => {
                        this.idleTimer = ref;
                    }}/>
                    <CSSTransitionGroup transitionEnterTimeout={100} transitionLeaveTimeout={500}
                                        transitionName="animation-hide">
                        {messages && messages.map((msg) =>
                            <Message key={msg.id} data={msg} unread={this.isUnreadMessage(msg)}
                                     onLoad={() => this.scrollToBottom(false, 0)}>
                                <Vote className="message--vote" message={msg}/>
                            </Message>)}
                    </CSSTransitionGroup>
                </ScrollPanel>
                {!this.isScrolledToBottom() && this.hasUnreadMessages() && (
                    <div className="room-content--scroll-to-bottom" onClick={() => {
                        this.scrollToBottom(true);
                        setTimeout(() => this.forceUpdate(), 1000);
                    }}
                         title="Scroll to bottom to read a new mesages">
                        <FontAwesomeIcon icon={faArrowCircleDown}/> New messages
                    </div>
                )}
                <CSSTransitionGroup transitionEnterTimeout={0} transitionLeaveTimeout={500}
                                    transitionName="animation-hide">
                    {!messages.length && (
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

const mapState = ({profile, messages}, {content}) => {
    let {name} = content;
    return {
        profile,
        messages: (messages[name] || []).slice(-100)
    };
};

export default connect(mapState)(RoomContent);