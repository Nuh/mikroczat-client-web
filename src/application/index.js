import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import {Helmet} from 'react-helmet';

import Loading from '../components/Loading';
import ConditionRoute from '../components/ConditionRoute';

import Header from './pages/fragments/Header';
import Footer from './pages/fragments/Footer';

import Main from './pages/main';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Logout from './pages/Logout';

import './index.css';

class Application extends Component {
    static contextTypes = {store: PropTypes.object};
    static propTypes = {
        authenticated: PropTypes.bool.isRequired,
        checked: PropTypes.bool.isRequired
    };

    render() {
        return (
            <div className="application-container">
                <Helmet titleTemplate="%s | MikroCzat.pl"></Helmet>
                <Header />
                <div className="body-container">
                    <ConditionRoute condition={!this.props.authenticated} path="/login" component={Login} redirect="/"/>
                    {this.props.checked ? (
                        <Switch>
                            <Route exact path="/" render={() => (<Redirect to="/room/general"/>)}/>
                            <Route path="/room/:name" component={Main}/>

                            <ConditionRoute condition={this.props.authenticated} path="/profile" component={Profile}/>
                            <ConditionRoute condition={this.props.authenticated} path="/logout" component={Logout}
                                            redirect="/"/>
                        </Switch>
                    ) : <Loading />}
                </div>
                <Footer/>
            </div>
        );
    }
}

const mapState = ({session}) => ({
    checked: session.checked,
    authenticated: session.authenticated
});

export default withRouter(connect(mapState)(Application));