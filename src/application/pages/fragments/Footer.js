import PropTypes from "prop-types";
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faExclamationTriangle, faSync} from '@fortawesome/free-solid-svg-icons'

import './Footer.css'

class Footer extends Component {
    static contextTypes = {store: PropTypes.object};

    reconnect() {
        let {client} = this.props;
        if (client) {
            client.connect();
        }
    };

    reload() {
        window.location.reload(true)
    }

    render() {
        let {state, latency, version, apiVersion} = this.props;
        let {REACT_APP_SUPPORT_API, REACT_APP_VERSION} = process.env;
        return (
            <Fragment>
                <footer>
                    {REACT_APP_SUPPORT_API && apiVersion && (~~Number(REACT_APP_SUPPORT_API) !== ~~Number(apiVersion) || Number(REACT_APP_SUPPORT_API) < Number(apiVersion)) && (
                        <div className="api-version-mismatch-message">
                        <span className="api-version-mismatch-message--icon"
                              title={`Your client support only ${REACT_APP_SUPPORT_API || 'development'} API version. Server API version: ${apiVersion}.`}>
                            <FontAwesomeIcon icon={faExclamationTriangle} transform="down-2"/>
                        </span>
                            Your client is too old to support current server API version.
                            <a className="api-version-mismatch-message--action" onClick={this.reload.bind(this)}>
                                Reload
                            </a>
                        </div>
                    )}
                    {state === 0 ? (
                        <span>Connecting...</span>
                    ) : (state === 1) ? (
                        <span>Connected{latency > 0 && ` (${latency}ms)`}</span>
                    ) : (state > 1) ? (
                        <a onClick={this.reconnect.bind(this)}>
                            <FontAwesomeIcon icon={faSync} transform="shrink-3 left-3 down-1"/>
                            Disconnected
                        </a>
                    ) : (
                        <span>Loading...</span>
                    )}
                    <div className="version">
                        Version:
                        <span className="version--client"
                              title="Client version">{REACT_APP_VERSION || 'DEVELOPMENT'}</span>
                        {version && (
                            <Fragment>
                                /<span className="version--server" title="Server version">{version}</span>
                            </Fragment>
                        )}
                    </div>
                </footer>
            </Fragment>
        );
    }
}


const mapState = ({client, server}) => ({
    client: client,
    state: server.state,
    latency: server.latency,
    apiVersion: server.apiVersion,
    version: server.version,
});

export default connect(mapState)(Footer);