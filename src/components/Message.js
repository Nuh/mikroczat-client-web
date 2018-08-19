import React, {Component} from 'react';
import * as moment from 'moment';

import User from './User';

import './Message.css';

class Message extends Component {
    render() {
        let {data} = this.props;
        let date = moment(data.created);
        return (
            <div className="message">
                <div className="message--timestamp" title={date.format("dddd, DD MMMM YYYY, HH:mm:ss")}>
                    {date.format('HH:mm:ss')}
                </div>
                <User className="message--user" data={data.author}/>
                <div className="message--message">
                    {data.data.message}
                </div>
            </div>
        );
    }
}

export default Message;