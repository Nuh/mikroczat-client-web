import {Component} from 'react';
import {createPortal} from 'react-dom';

class TrayElements extends Component {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
    }

    componentDidMount() {
        document.getElementById('tray').appendChild(this.el);
    }

    componentWillUnmount() {
        document.getElementById('tray').removeChild(this.el);
    }

    render() {
        return createPortal(
            this.props.children,
            this.el,
        );
    }
}

export default TrayElements;