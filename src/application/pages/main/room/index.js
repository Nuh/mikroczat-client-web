import PropTypes from "prop-types";
import React, {Component} from 'react';
import {connect} from "react-redux";
import SplitPane from 'react-split-pane';
import * as find from "lodash/find";

import Television from './Television';
import RoomContent from './Content';

class Room extends Component {
    static contextTypes = {store: PropTypes.object};

    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: true
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
                       onDragStarted={ e => document.getElementById('television').style.pointerEvents = 'none' }
                       onDragFinished={ e => document.getElementById('television').style.pointerEvents = 'initial' }>
                <Television url={channel.properties.embed} />
                <RoomContent content={channel} />
            </SplitPane>
        ) : (
            <div>Loading...</div>
        );
    }
}

const mapState = ({channels}, {chosen}) => {
    return {
        channel: find(channels.joined, (ch) => ch.name.toLowerCase() === (chosen || '').toLowerCase())
    };
};

export default connect(mapState)(Room);