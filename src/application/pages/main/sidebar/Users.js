import PropTypes from "prop-types";
import React, {Component} from 'react';

import Loading from '../../../../components/Loading';
import User from '../../../../components/User';

import './index.css';

class Users extends Component {
    static contextTypes = {store: PropTypes.object};
    static propTypes = {channel: PropTypes.object.isRequired};

    render() {
        let {channel} = this.props;
        return channel && channel.users ?
            channel.users.map((user, index) => (
                <User key={index} data={user}/>
            )) : <Loading/>;
    }
}

export default Users;