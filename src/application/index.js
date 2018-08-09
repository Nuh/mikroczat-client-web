import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Switch, Route} from 'react-router-dom';
import {ConnectedRouter} from 'connected-react-router'
import {Helmet} from 'react-helmet';
import PropTypes from 'prop-types';

import './index.css';

import ConditionRoute from '../components/ConditionRoute';
import Dashboard from './pages/Dashboard';
import Room from './pages/Room';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Logout from './pages/Logout';

class Application extends Component {
    static contextTypes = {store: PropTypes.object};
    static propTypes = {
        authenticated: PropTypes.bool.isRequired,
        checked: PropTypes.bool.isRequired
    };

    render() {
        return this.props.checked ? (
            <div className="App">
                <Helmet titleTemplate="%s | MikroCzat.pl"></Helmet>
                <header className="App-header">
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    <ConnectedRouter history={this.props.history}>
                        <Switch>
                            <Route path="/" exact component={Dashboard}/>
                            <Route path="/room/:name" component={Room}/>

                            <ConditionRoute condition={this.props.authenticated} path="/profile" component={Profile}/>
                            <ConditionRoute condition={!this.props.authenticated} path="/login" component={Login}
                                            redirect="/"/>
                            <ConditionRoute condition={this.props.authenticated} path="/logout" component={Logout}
                                            redirect="/"/>

                        </Switch>
                    </ConnectedRouter>
                </p>
            </div>
        ) : (
            <div>Loading...</div>
        );
    }
}

const mapState = ({session}) => ({
    checked: session.checked,
    authenticated: session.authenticated
});

export default connect(mapState)(Application);