import PropTypes from "prop-types";
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSync} from '@fortawesome/free-solid-svg-icons'

import './Footer.css'

class Footer extends Component {
    static contextTypes = {store: PropTypes.object};

    constructor(props, context) {
        super(props, context);
        this.refresh = this.refresh.bind(this);
    }

    refresh() {
        let {client} = this.props;
        if (client) {
            client.connect();
        }
    };

    render() {
        return (
            <footer>
                {this.props.state === 0 ? (
                    <span>Connecting...</span>
                ) : (this.props.state === 1) ? (
                    <span>Connected{this.props.latency >= 0 && ` (${this.props.latency}ms)`}</span>
                ) : (this.props.state > 1) ? (
                    <a onClick={this.refresh}>
                        <FontAwesomeIcon icon={faSync} transform="shrink-3 left-3 down-1" />
                        Disconnected
                    </a>
                ) : (
                    <span>Loading...</span>
                )}
                {this.props.version && <div className="version">Version: {this.props.version}</div>}
            </footer>
        );
    }
}


const mapState = ({client, server}) => ({
    client: client,
    state: server.state,
    latency: server.latency,
    version: server.version
});

export default connect(mapState)(Footer);