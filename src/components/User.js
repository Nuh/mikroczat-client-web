import PropTypes from 'prop-types';
import React from 'react';

import Loading from '../components/Loading';

import './User.css';

const User = ({className, data}) => {
    return data ? (
        <div className={`${className || ''} user`} title={data.username}>
            <img className="user--avatar" alt={data.username} src={data.avatar || '/img/no-avatar.png'}/>
            <div className="user--login">
                {data.username}
            </div>
        </div>
    ) : <Loading/>;
};

User.propTypes = {
    className: PropTypes.any,
    data: PropTypes.object.isRequired
};

export default User;