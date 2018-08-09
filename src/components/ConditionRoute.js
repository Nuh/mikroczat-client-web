import React from 'react';
import PropTypes from 'prop-types';
import {Route, Redirect} from 'react-router-dom';

const ConditionRoute = ({component, exact = false, path, condition = true, redirect = '/login'}) => (
    <Route
        exact={exact}
        path={path}
        render={props => (
            condition ? (
                React.createElement(component, props)
            ) : (
                <Redirect to={{
                    pathname: redirect,
                    state: {from: props.location}
                }}/>
            )
        )}
    />
);

ConditionRoute.propTypes = {
    component: PropTypes.func.isRequired,
    exact: PropTypes.bool,
    path: PropTypes.string.isRequired,
    condition: PropTypes.bool,
    redirect: PropTypes.string,
    location: PropTypes.object
};

export default ConditionRoute;