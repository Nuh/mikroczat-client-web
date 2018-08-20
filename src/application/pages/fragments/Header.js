import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';

import configuration from "../../../configuration";

import AuthorizateButton from '../../../components/AuthorizateButton';

import './Header.css'

class Header extends Component {
    render() {
        return (
            <header>
                <NavLink to={`/room/${configuration.channels.default}`} activeClassName="blocked">MikroCzat</NavLink>
                <div id="tray" className="tray">
                    {this.props.checked && <AuthorizateButton isAuthorizated={this.props.authenticated}/>}
                </div>
            </header>
        );
    }
}

const mapState = ({session}) => ({
    checked: session.checked,
    authenticated: session.authenticated
});

export default connect(mapState)(Header);