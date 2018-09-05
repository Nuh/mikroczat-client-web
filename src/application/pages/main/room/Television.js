import * as size from 'lodash/size';
import * as isEqual from 'lodash/isEqual';
import * as castArray from 'lodash/castArray';
import PropTypes from "prop-types";
import React, {Component, Fragment} from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

import './Television.css';

class Television extends Component {
    static propTypes = {
        url: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
        timeleft: PropTypes.number
    };

    constructor(props) {
        super(props);
        this.state = {
            url: castArray(props.url),
            changing: null,
            timeleft: 0
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.change(nextProps.url) || !isEqual(this.state, nextState);
    }

    componentWillUnmount() {
        this.cancel();
    }

    change(url, force) {
        const count = () => {
            const stepInterval = 1;
            setTimeout(() => {
                let {changing, timeleft} = this.state;
                if (changing && timeleft > 0) {
                    this.setState({timeleft: Math.max(0, timeleft - stepInterval)});
                    count();
                }
            }, stepInterval * 1000);
        };

        let timeleft = this.props.timeleft || 10;
        if (force || !size(this.state.url) || timeleft <= 0) {
            this.cancel();
            setTimeout(this.setState({url: castArray(url)}), 0);
            return true;
        } else if ([this.props.url, this.state.url].indexOf(url) === -1) {
            this.cancel();
            setTimeout(() => {
                this.setState({timeleft, changing: setTimeout(() => this.change(url, true), timeleft * 1000)});
                count();
            }, 0);
            return true;
        }
        return false;
    }

    cancel() {
        let {changing} = this.state;
        if (changing) {
            this.setState({timeleft: 0, changing: clearTimeout(changing)});
        }
    }

    render() {
        let {className} = this.props;
        let {url, changing, timeleft} = this.state;
        return (
            <div id="television" className={`${className || ''} television ${!url ? 'empty' : ''}`}>
                <CSSTransitionGroup transitionEnterTimeout={100} transitionLeaveTimeout={500}
                                    transitionName="animation-hide">
                    {changing && (
                        <div className="television--notifaction">
                            <Fragment>
                                {url ? (<Fragment>Change</Fragment>) : (<Fragment>Remove</Fragment>)} in
                                {timeleft ? `${~~timeleft} seconds` : 'a moment'}
                            </Fragment>
                            <a className="television--notifaction-action" onClick={this.cancel.bind(this)}>Cancel</a>
                            <a className="television--notifaction-action"
                               onClick={() => this.change.bind(this)(url, true)}>
                                {size(url) ? 'Change now' : 'Remove now'}
                            </a>
                        </div>
                    )}
                </CSSTransitionGroup>
                {!size(url) ? 'Empty... :(' : (
                    <iframe title="Embedded content" src={url} allow="autoplay; encrypted-media" allowFullScreen
                            sandbox="allow-same-origin allow-scripts"/>
                )}
            </div>
        );
    }
}

export default Television;