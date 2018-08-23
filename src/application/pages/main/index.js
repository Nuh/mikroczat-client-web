import * as find from "lodash/find";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import React, {Component} from 'react';
import {connect} from "react-redux";
import {Helmet} from 'react-helmet';
import SplitPane from 'react-split-pane';
import {CSSTransitionGroup} from 'react-transition-group';

import * as settingsActions from "../../actions/settings";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUsers} from '@fortawesome/free-solid-svg-icons'

import Room from './room';
import Sidebar from './sidebar';

import Loading from '../../../components/Loading';
import TrayElements from '../../../components/TrayElements';

const SETTINGS_FIELD_SIDEBAR_VISIBLE = 'sidebarVisible';

class Main extends Component {
    static contextTypes = {store: PropTypes.object};

    getName() {
        let name = this.props.match.params.name;
        return name;
    }

    getTitle() {
        if (!this.getName()) {
            return 'Loading...'
        }
        return `#${this.getName()}`;
    }

    validate() {
        let {client, myChannels} = this.props;
        let name = this.getName();
        if (client && (!myChannels || !myChannels[name])) {
            client.join(name);
        }
    }

    calculatePercentWidth(width, func = 'min', px) {
        let calc = window.innerWidth * width;
        return px ? Math[func](calc, px) : calc;
    }

    render() {
        let {actions} = this.props;
        let visible = this.props[SETTINGS_FIELD_SIDEBAR_VISIBLE] !== false;
        this.validate();
        return (
            <div>
                <Helmet>
                    <title>{this.getTitle()}</title>
                </Helmet>
                <TrayElements>
                    <a onClick={e => actions.toggleState(SETTINGS_FIELD_SIDEBAR_VISIBLE)}
                       style={{opacity: visible ? 1 : 0.5}}>
                        <FontAwesomeIcon icon={faUsers}/>
                    </a>
                </TrayElements>
                <SplitPane primary="second" allowResize={visible}
                           pane2Style={{
                               maxWidth: visible ? '100vw' : '0',
                               opacity: visible ? '1' : '0',
                               transition: 'max-width 500ms ease, opacity 500ms linear'
                           }}
                           minSize={this.calculatePercentWidth(0.15, 'min', 300)}
                           maxSize={this.calculatePercentWidth(0.25, 'max', 450)}
                           defaultSize={this.calculatePercentWidth(0.25, 'min', 366)}>
                    <Room chosen={this.getName()}/>
                    <CSSTransitionGroup
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={500}
                        transitionName="animation-hide">
                        {visible ? (
                            <Sidebar key="sidebar" channel={this.props.channel}/>
                        ) : (
                            <Loading key="loading"/>
                        )}
                    </CSSTransitionGroup>
                </SplitPane>
            </div>
        );
    }
}

const mapState = ({client, myChannels, settings}, {match}) => {
    let name = match && match.params ? match.params.name : null;
    let settingsState = (settings || {}).state || {};
    return {
        client: client,
        channel: find(myChannels, (ch) => ch.name.toLowerCase() === (name || '').toLowerCase()),
        channels: myChannels,
        sidebarVisible: settingsState[SETTINGS_FIELD_SIDEBAR_VISIBLE],
    };
};

const mapDispatch = (dispatch) => {
    return {
        actions: bindActionCreators(settingsActions, dispatch)
    };
};

export default connect(mapState, mapDispatch)(Main);