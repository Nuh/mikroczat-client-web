import PropTypes from "prop-types";
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as sessionActions from '../actions/session';
import configuration from '../../configuration';

import Loading from '../../components/Loading';

class Login extends Component {
    static contextTypes = {store: PropTypes.object};
    static propTypes = {location: PropTypes.object.isRequired};

    componentWillMount() {
        let strategy = this.getParams('strategy') || this.getParams('channel') || 'wykop';
        let token = this.getParams('token') || this.getParams('connectData');
        if (token) {
            const {login} = this.props.actions;
            login(strategy, token);
        } else {
            let server = configuration.server.auth || 'http;//localhost:8080/login';
            let redirect = window.location.href;
            window.location.href = `${server}?strategy=${strategy}&redirect=${redirect}`;
        }
    }

    getParams(...args) {
        let params = new URLSearchParams(this.props.location.search);
        if (args.length === 1) {
            return params.get(args[0]);
        } else if (args.length > 1) {
            return args.map((arg) => params.get(arg));
        }
        return params;
    }

    render() {
        return <Loading />;
    }
}

const mapDispatch = (dispatch) => {
    return {
        actions: bindActionCreators(sessionActions, dispatch)
    };
};

export default connect(null, mapDispatch)(Login);