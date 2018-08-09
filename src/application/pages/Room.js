import React, {Component} from 'react';

export default class Room extends Component {
    render() {
        return (
            <div>{this.props.match.params.name}</div>
        );
    }
}