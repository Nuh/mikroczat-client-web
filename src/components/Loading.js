import * as castArray from 'lodash/castArray';
import * as flattenDeep from 'lodash/flattenDeep';
import * as sample from 'lodash/sample'
import React, {Component} from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons'

import './Loading.css';
import PropTypes from "prop-types";

class Loading extends Component {
    static propTypes = {
        showIcon: PropTypes.bool,
        description: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string)
        ])
    };

    constructor(props) {
        super(props);
        this.state = {
            description: sample(flattenDeep(castArray(props.description)))
        };
        this.reference = React.createRef();
    }

    componentDidMount() {
        let node = this.reference.current;
        this.relativeElement = node ? node.parentNode : null;
        while (this.relativeElement.parentNode && !this.relativeElement.clientHeight) {
            this.relativeElement = this.relativeElement.parentNode;
        }
        if (this.relativeElement) {
            this.relativeElementOriginalPosition = this.relativeElement.style.position;
            this.relativeElement.style.position = 'relative';
        }
    }

    componentWillUnmount() {
        if (this.relativeElement) {
            this.relativeElement.style.position = this.relativeElementOriginalPosition;
        }
    }

    render() {
        let {showIcon, children} = this.props;
        let {description} = this.state;
        return (
            <div ref={this.reference} className="loading">
                {showIcon !== false && <FontAwesomeIcon className="loading--spinner" icon={faCircleNotch} spin/>}
                {description && (<span className="loading--description">{description}</span>)}
                {children}
            </div>
        );
    }
}

export default Loading;