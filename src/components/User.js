import PropTypes from 'prop-types';
import React from 'react';

import './User.css';

const User = ({data}) => {
    console.log(data);
    return data ? (
        <div className="user">
            <img className="user--avatar" src={data.avatar} />
            <div className="user--login">
                {data.username}
            </div>
        </div>
    ) : (
        <div>Loading...</div>
    );
};

User.propTypes = {
    data: PropTypes.object.isRequired
};

export default User;