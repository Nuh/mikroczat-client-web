import * as filter from 'lodash/filter';
import PropTypes from "prop-types";
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';

import Loading from '../../../../components/Loading';
import User from '../../../../components/User';

import './index.css';

class Users extends Component {
    static propTypes = {
        profile: PropTypes.object,
        channel: PropTypes.object.isRequired
    };

    render() {
        let {channel, profile} = this.props;
        if (channel) {
            let {users} = channel;
            if (users) {
                let usersWithoutMe = filter(users, (u) => !profile || u.username !== profile.username || u.type !== profile.type);
                return (
                    <Fragment>
                        {profile && <User data={profile}/>}
                        {usersWithoutMe && usersWithoutMe.map((user, index) => (
                            <User key={index} data={user}/>
                        ))}
                    </Fragment>
                )
            }
        }
        return <Loading />;
    }
}


const mapState = ({profile}) => {
    return {
        profile
    };
};

export default connect(mapState)(Users);