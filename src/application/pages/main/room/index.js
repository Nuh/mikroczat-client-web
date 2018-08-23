import * as find from "lodash/find";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import React, {Component} from 'react';
import {connect} from "react-redux";
import SplitPane from 'react-split-pane';
import {CSSTransitionGroup} from 'react-transition-group';

import * as settingsActions from "../../../actions/settings";

import Loading from '../../../../components/Loading';

import Television from './Television';
import RoomContent from './Content';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faVideo, faVideoSlash} from '@fortawesome/free-solid-svg-icons'

const SETTINGS_FIELD_TELEVISION_VISIBLE = 'televisionVisible';

class Room extends Component {
    static contextTypes = {store: PropTypes.object};

    calculatePercentWidth(width, func = 'min', px) {
        let calc = window.innerWidth * width;
        return px ? Math[func](calc, px) : calc;
    }

    render() {
        let {actions, channel, televisionVisible} = this.props;
        return channel ? (
            <SplitPane allowResize={televisionVisible}
                       pane1Style={{
                           maxWidth: televisionVisible ? '100vw' : '0',
                           opacity: televisionVisible ? '1' : '0',
                           transition: 'max-width 500ms ease, opacity 500ms linear'
                       }}
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
                       }}
                       onChange={size => localStorage.setItem('splitPos', size)}>
                <CSSTransitionGroup transitionEnterTimeout={500} transitionLeaveTimeout={500}
                                    transitionName="test">
                    {televisionVisible ? (
                        <Television url={channel.properties.embed}/>
                    ) : (
                        <Loading/>
                    )}
                </CSSTransitionGroup>
                <RoomContent content={channel}>
                    {(channel.properties.embed || televisionVisible) &&
                    <a onClick={e => actions.toggleState(SETTINGS_FIELD_TELEVISION_VISIBLE)}>
                        <FontAwesomeIcon icon={televisionVisible ? faVideoSlash : faVideo}
                                         transform="shrink-3 left-3 down-1"/>
                    </a>
                    }
                </RoomContent>
            </SplitPane>
        ) : <Loading/>
    }
}

const mapState = ({myChannels, settings}, {chosen}) => {
    let settingsState = (settings || {}).state || {};
    return {
        channel: find(myChannels, (ch) => ch.name.toLowerCase() === (chosen || '').toLowerCase()),
        televisionVisible: settingsState[SETTINGS_FIELD_TELEVISION_VISIBLE],
    };
};

const mapDispatch = (dispatch) => {
    return {
        actions: bindActionCreators(settingsActions, dispatch)
    };
};

export default connect(mapState, mapDispatch)(Room);