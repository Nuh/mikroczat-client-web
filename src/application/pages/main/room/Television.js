import PropTypes from "prop-types";
import React, {Component} from 'react';

import './Television.css';

class Television extends Component {
    static contextTypes = {store: PropTypes.object};
    static propTypes = {url: PropTypes.string};

    render() {
        //let {url} = this.props;
        let url = "https://www.youtube.com/embed/jNQXAC9IVRw?loop=1&modestbranding=1";
        return url ? (
            <iframe id="television" sandbox="allow-same-origin allow-scripts" src={url}/>
        ) : (<div id="television" className="empty">
            Empty :(
        </div>);
    }
}


export default Television;