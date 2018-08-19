import * as find from "lodash/find";
import PropTypes from "prop-types";
import React, {Component} from 'react';
import {connect} from "react-redux";
import {Helmet} from 'react-helmet';
import SplitPane from 'react-split-pane';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUsers} from '@fortawesome/free-solid-svg-icons'

import Room from './room';
import Sidebar from './sidebar';

import TrayElements from '../../../components/TrayElements';

class Main extends Component {
    static contextTypes = {store: PropTypes.object};

    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: true
        };
    }

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

    toggleSidebar() {
        this.setState({
            visible: !this.state.visible
        });
    }

    render() {
        this.validate();
        return (
            <div>
                <Helmet>
                    <title>{this.getTitle()}</title>
                </Helmet>
                <TrayElements>
                    <a onClick={() => this.toggleSidebar()} style={{opacity: this.state.visible ? 1 : 0.5}}>
                        <FontAwesomeIcon icon={faUsers} />
                    </a>
                </TrayElements>
                <SplitPane split="vertical" primary="second" pane2Style={{display: this.state.visible ? 'block' : 'none'}}
                           minSize={this.calculatePercentWidth(0.15, 'min', 300)}
                           maxSize={this.calculatePercentWidth(0.25, 'max', 450)}
                           defaultSize={this.calculatePercentWidth(0.25, 'min', 366)}>
                    <Room chosen={this.getName()} />
                    {this.state.visible && <Sidebar channel={this.props.channel} />}
                </SplitPane>
            </div>
        );
    }
}

const mapState = ({client, myChannels}, {match}) => {
    let name = match && match.params ? match.params.name : null;
    return {
        client: client,
        channel: find(myChannels, (ch) => ch.name.toLowerCase() === (name || '').toLowerCase()),
        channels: myChannels
    };
};

export default connect(mapState)(Main);