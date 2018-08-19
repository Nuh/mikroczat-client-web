import PropTypes from "prop-types";
import React, {Component} from 'react';
import {connect} from "react-redux";
import SplitPane from 'react-split-pane';
import * as find from "lodash/find";

import Loading from '../../../../components/Loading';

import Television from './Television';
import RoomContent from './Content';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faVideo, faVideoSlash} from '@fortawesome/free-solid-svg-icons'

class Room extends Component {
    static contextTypes = {store: PropTypes.object};

    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: false
        };
    }

    calculatePercentWidth(width, func = 'min', px) {
        let calc = window.innerWidth * width;
        return px ? Math[func](calc, px) : calc;
    }

    toggleTelevision() {
        this.setState({
            visible: !this.state.visible
        });
    }

    render() {
        let {channel} = this.props;
        return channel ? (
            <SplitPane split="vertical" pane1Style={{display: this.state.visible ? 'block' : 'none'}}
                       minSize={this.calculatePercentWidth(0.4, 'min', 400)}
                       maxSize={this.calculatePercentWidth(0.6, 'max', 1000)}
                       defaultSize={this.calculatePercentWidth(0.6, 'max', 1000)}
                       onDragStarted={e => {
                           let el = document.getElementById('television');
                           if (el) {
                               el.style.pointerEvents = 'none';
                           }
                       }}
                       onDragFinished={e => {
                           let el = document.getElementById('television');
                           if (el) {
                               el.style.pointerEvents = 'initial'
                           }
                       }}>
                {this.state.visible ? (
                    <Television url={channel.properties.embed}/>
                ) : (
                    <Loading/>
                )}
                <RoomContent content={channel}>
                    {(channel.properties.embed || this.state.visible) &&
                    <a onClick={this.toggleTelevision.bind(this)}>
                        <FontAwesomeIcon icon={this.state.visible ? faVideoSlash : faVideo}
                                         transform="shrink-3 left-3 down-1"/>
                    </a>
                    }
                </RoomContent>
            </SplitPane>
        ) : <Loading/>
    }
}

const mapState = ({myChannels}, {chosen}) => {
    return {
        channel: find(myChannels, (ch) => ch.name.toLowerCase() === (chosen || '').toLowerCase())
    };
};

export default connect(mapState)(Room);