import PropTypes from 'prop-types';
import React from 'react';
import {NavLink} from 'react-router-dom';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHashtag} from '@fortawesome/free-solid-svg-icons'

import Loading from '../components/Loading';

import './Channel.css';

const Channel = ({data, joined}) => {
    return data ? (
        <NavLink to={`/room/${data.name}`} className="channel" activeClassName="blocked" target="_blank">
            <div className="channel--avatar"><FontAwesomeIcon icon={faHashtag} /></div>
            <span className="channel--name">{data.name}</span>
            <span className="channel--users">{joined ? data.users.length : data.users}</span>
        </NavLink>
    ) : <Loading />;
};

Channel.propTypes = {
    joined: PropTypes.bool,
    data: PropTypes.object.isRequired
};

export default Channel;