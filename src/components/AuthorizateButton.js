import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSignInAlt, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'

import './AuthorizateButton.css';

const AuthorizateButton = ({isAuthorizated = false, loginPath = '/login', logoutPath = '/logout'}) => isAuthorizated ? (
    <Link className="authorization" to={logoutPath}>
        <div className="authorization--text">
            <FontAwesomeIcon icon={faSignOutAlt} transform="shrink-3 left-3 down-1"/>
            Log out
        </div>
    </Link>
) : (
    <Link className="authorization" to={loginPath}>
        <div className="authorization--text">
            <FontAwesomeIcon icon={faSignInAlt} transform="shrink-3 left-3 down-1"/>
            Log in
        </div>
    </Link>
);


AuthorizateButton.propTypes = {
    isAuthorizated: PropTypes.bool.isRequired,
    loginPath: PropTypes.string,
    logoutPath: PropTypes.string
};

export default AuthorizateButton;