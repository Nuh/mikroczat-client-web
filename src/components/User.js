import PropTypes from 'prop-types';
import React from 'react';

import Image from '../components/Image';
import Loading from '../components/Loading';

import './User.css';

const User = ({className, data}) => {
    return data ? (
        <div title={data.username}
             className={`${className || ''} user ${data.sex === 'm' ? 'user--male' : data.sex === 'f' ? 'user--female' : data.sex === 'b' ? 'user--bot' : ''}`}>
            <Image className="user--avatar" alt={data.username} src={data.avatar || '/img/no-avatar.png'}
                   fullSrc={data.fullAvatar || data.avatar || '/img/no-avatar.png'}/>
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