import * as isEqual from 'lodash/isEqual';
import PropTypes from "prop-types";
import React, {Component, Fragment} from 'react';

import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons'

import './Image.css';

class Image extends Component {
    static propTypes = {
        className: PropTypes.string,
        src: PropTypes.string.isRequired,
        fullSrc: PropTypes.string,
        alt: PropTypes.string,
        downloadable: PropTypes.bool,
        lightbox: PropTypes.bool,
        animation: PropTypes.bool,
        onClick: PropTypes.func,
        onLoad: PropTypes.func,
        onLoadError: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !isEqual(this.props.src, nextProps.src) || !isEqual(this.props.fullSrc, nextProps.fullSrc) || !isEqual(this.state, nextState);
    }

    render() {
        let {className, src, fullSrc, alt, lightbox, downloadable, animation} = this.props;
        let {open} = this.state;
        const _onClick = (...args) => {
                let [e] = args;
                let {onClick} = this.props;
                if ((!onClick || !onClick instanceof Function || onClick.apply(this, args)) && this.success !== false) {
                    this.setState({open: true});
                }
                if (this.success !== false) {
                    e.preventDefault();
                    return false;
                }
            },
            _onLoad = (...args) => {
                let {onLoad} = this.props;
                if (onLoad && onLoad instanceof Function) {
                    onLoad.apply(this, args);
                }
                this.success = true;
            },
            _onLoadError = (...args) => {
                let {onLoadError} = this.props;
                if (onLoadError && onLoadError instanceof Function) {
                    onLoadError.apply(this, args);
                }
                this.success = false;
                this.setState({open: false});
            };
        return React.createElement(downloadable !== false ? 'a' : 'span', {
            className: `${className || ''} image ${animation ? 'image--animation' : 'image--static'}`,
            title: alt || fullSrc || src,
            onClick: _onClick,
            href: fullSrc || src,
            target: '_blank'
        }, (
            <Fragment>
                <img src={src || fullSrc} alt={alt || fullSrc || src} referrerPolicy="no-referrer"
                     onLoad={_onLoad} onError={_onLoadError}/>
                {lightbox !== false && open && (
                    <Lightbox mainSrc={fullSrc || src} enableZoom={true} imageReferrerPolicy="no-referrer"
                              clickOutsideToClose={true} onCloseRequest={() => this.setState({open: false})}
                              toolbarButtons={downloadable === false ? [] : [(
                                  <button className="image--lightbox--external-link" title="Open in a new window"
                                          onClick={e => window.open(fullSrc || src, '_blank')}>
                                      <FontAwesomeIcon icon={faExternalLinkAlt} transform="down-2"/>
                                  </button>
                              )]}/>
                )}
            </Fragment>
        ));
    }
}

export default Image;