import * as isEqual from 'lodash/isEqual';
import PropTypes from "prop-types";
import React, {Component, Fragment} from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

import './Television.css';

class Television extends Component {
    static propTypes = {
        url: PropTypes.string,
        timeleft: PropTypes.number
    };

    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
            changing: null,
            timeleft: 10
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
            setTimeout(() => {
                let {changing, timeleft} = this.state;
                if (changing && timeleft > 0) {
                    this.setState({timeleft: timeleft - 1});
                    count();
                }
            }, 1000);
        };

        if (force || !this.state.url) {
            this.cancel();
            setTimeout(this.setState({url}), 0);
            return true;
        } else if ([this.props.url, this.state.url].indexOf(url) === -1) {
            this.cancel();
            setTimeout(() => {
                this.setState({timeleft: 10, changing: setTimeout(() => this.change(url, true), 10000)});
                count();
            }, 0);
            return true;
        }
        return false;
    }

    cancel() {
        let {changing} = this.state;
        if (changing) {
            clearTimeout(changing);
            this.setState({timeleft: 0, changing: null});
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
                                {this.props.url ? (
                                    <Fragment>
                                        Changing to <a href={this.props.url} target="_blank">{this.props.url}</a>
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        Remove
                                    </Fragment>
                                )} in {timeleft ? `${~~timeleft} seconds` : 'a moment'}
                            </Fragment>
                            <a className="television--notifaction-action" onClick={this.cancel.bind(this)}>
                                Cancel
                            </a>
                            <a className="television--notifaction-action"
                               onClick={() => this.change.bind(this)(this.props.url, true)}>
                                {this.props.url ? 'Change now' : 'Remove now'}
                            </a>
                        </div>
                    )}
                </CSSTransitionGroup>
                {!url ? 'Empty... :(' : (
                    <iframe title="Embedded content" src={url} allow="autoplay; encrypted-media" allowFullScreen
                            sandbox="allow-same-origin allow-scripts"/>
                )}
            </div>
        );
    }
}

export default Television;