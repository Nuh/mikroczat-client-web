import PropTypes from "prop-types";
import React, {Component} from 'react';

import './Television.css';

class Television extends Component {
    static contextTypes = {store: PropTypes.object};
    static propTypes = {url: PropTypes.string};

    render() {
        let {url} = this.props;
        return url ? (
            <iframe id="television" title="Embedded content" src={url}
                    allow="autoplay; encrypted-media" allowFullScreen
                    sandbox="allow-same-origin allow-scripts"/>
        ) : (
            <div id="television" className="empty">
                Empty :(
            </div>
        );
    }
}

export default Television;