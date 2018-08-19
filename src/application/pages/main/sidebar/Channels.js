import * as map from 'lodash/map';
import * as find from 'lodash/find';
import * as filter from 'lodash/filter';
import PropTypes from "prop-types";
import React, {Component} from 'react';
import {connect} from 'react-redux';

import Loading from '../../../../components/Loading';

import history from '../../../../store/history';
import Channel from '../../../../components/Channel';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDoorOpen} from "@fortawesome/free-solid-svg-icons/index";

import './Channels.css';

class Channels extends Component {
    static contextTypes = {store: PropTypes.object};
    static propTypes = {chosen: PropTypes.object};

    constructor(props, context) {
        super(props, context);
        this.state = {
            name: ''
        };
    }

    handleChange(event) {
        this.setState({name: event.target.value})
    }

    handleSubmit(event) {
        let {name} = this.state;
        event.preventDefault();
        history.push(`/room/${name}`);
    }

    render() {
        let {available, joined} = this.props;
        let availableWithoutJoined = filter(available, (ch) => !find(joined, (j) => j.name === ch.name));

        let joinedList = !joined ? '' : map(joined, (channel, index) => (
            <Channel key={index} joined={true} data={channel}/>
        ));
        let availableList = !available ? '' : map(availableWithoutJoined, (channel, index) => (
            <Channel key={index} data={channel}/>
        ));

        return (
            <div className="channels">
                <form className="channels--input" onSubmit={this.handleSubmit.bind(this)}>
                    <input placeholder="Room name..." type="text" value={this.state.name}
                           onChange={this.handleChange.bind(this)}/>
                    <div className="channels--input-options--right">
                        <button type="submit">
                            <FontAwesomeIcon icon={faDoorOpen} transform="left-1 down-2"/>
                        </button>
                    </div>
                </form>
                {available === undefined ? (
                    <Loading/>
                ) : [
                    joinedList,
                    availableList
                ]}
            </div>);
    }
}

const mapState = ({myChannels, channels}) => {
    return {
        joined: myChannels,
        available: channels
    };
};

export default connect(mapState)(Channels);