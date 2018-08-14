import PropTypes from "prop-types";
import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';

import './index.css';

class Channels extends Component {
    static contextTypes = {store: PropTypes.object};
    static propTypes = {chosen: PropTypes.string.isRequired};

    getName() {
        return 'dd';
    }

    render() {
        let {available, joined} = this.props;
        return available ?
            available.map((channel, index) => (
                <div key={index}>
                    <NavLink to={`/room/${channel.name}`} activeClassName="blocked">
                        #{channel.name} ({channel.users})
                    </NavLink>
                </div>
            )) : (<div>Loading...</div>);
    }
}

const mapState = ({channels}) => {
    return {
        joined: channels.joined,
        available: channels.available
    };
};

export default connect(mapState)(Channels);