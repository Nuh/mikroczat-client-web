import PropTypes from "prop-types";
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as sessionActions from '../actions/session';

import Loading from '../../components/Loading';

class Logout extends Component {
    static contextTypes = {store: PropTypes.object};
    static propTypes = {location: PropTypes.object.isRequired};

    componentWillMount() {
        const {logout} = this.props.actions;
        logout();
    }

    render() {
        return <Loading/>;
    }
}

const mapDispatch = (dispatch) => {
    return {
        actions: bindActionCreators(sessionActions, dispatch)
    };
};

export default connect(null, mapDispatch)(Logout);