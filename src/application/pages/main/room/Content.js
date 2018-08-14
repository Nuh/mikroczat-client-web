import PropTypes from "prop-types";
import React, {Component} from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faVideo, faVideoSlash, faSmile, faArrowCircleRight} from '@fortawesome/free-solid-svg-icons'

import './Content.css';

class RoomContent extends Component {
    static contextTypes = {store: PropTypes.object};
    static propTypes = {content: PropTypes.object};

    render() {
        let {content} = this.props;
        return (
            <div className="room-content">
                <div className="room-content--title">
                    <a onClick={e => console.log('test')}>
                        <FontAwesomeIcon icon={faVideo} transform="shrink-3 left-2 down-1"/>
                    </a>
                    <b>#{content.name}</b>
                    {content.properties.title ? ` | ${content.properties.title}` : ''}
                </div>
                <div className="room-content--messages">
                    pisanko
                </div>
                <form className="room-content--input">
                    <div className="room-content--input-options">
                        <a onClick={e => console.log('test')}>
                            <FontAwesomeIcon icon={faSmile} transform="right-2 down-2"/>
                        </a>
                    </div>
                    <input/>
                    <div className="room-content--input-options--right">
                        <button type="submit" onClick={e => console.log('test')}>
                            <FontAwesomeIcon icon={faArrowCircleRight} transform="left-2 down-2"/>
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}


export default RoomContent;