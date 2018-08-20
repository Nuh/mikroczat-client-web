import React, {Component} from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons'

import './Loading.css';

class Loading extends Component {
    constructor(props) {
        super(props);
        this.reference = React.createRef();
    }

    componentDidMount() {
        let node = this.reference.current;
        let parent = node ? node.parentNode : null;
        if (parent) {
            this.oldParentPosition = parent.style.position;
            parent.style.position = 'relative';
        }
    }

    componentWillUnmount() {
        let node = this.reference.current;
        let parent = node ? node.parentNode : null;
        if (parent) {
            parent.style.position = this.oldParentPosition;
        }
    }

    render() {
        let {showIcon, children} = this.props;
        return (
            <div ref={this.reference} className="loading">
                {showIcon !== false && <FontAwesomeIcon icon={faCircleNotch} spin />}
                {children || ''}
            </div>
        );
    }
}

export default Loading;