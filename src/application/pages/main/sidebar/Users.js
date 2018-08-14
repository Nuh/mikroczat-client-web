import * as find from 'lodash/find';
import PropTypes from "prop-types";
import React, {Component} from 'react';
import {connect} from 'react-redux';

import User from '../../../../components/User';

import './index.css';

class Users extends Component {
    static contextTypes = {store: PropTypes.object};
    static propTypes = {chosen: PropTypes.string.isRequired};

    render() {
        let {channel} = this.props;
        return channel && channel.users ?
            channel.users.map((user, index) => (
                <User key={index} data={user}/>
            )) : (<div>Loading...</div>);
    }
}

const mapState = ({channels}, {chosen}) => {
    return {
        channel: find(channels.joined, (ch) => ch.name.toLowerCase() === (chosen || '').toLowerCase())
    };
};

export default connect(mapState)(Users);