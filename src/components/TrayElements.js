import {Component} from 'react';
import {createPortal} from 'react-dom';

class TrayElements extends Component {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
        this.targetId = this.props.targetId || 'tray';
    }

    componentDidMount() {
        document.getElementById(this.targetId).appendChild(this.el);
    }

    componentWillUnmount() {
        document.getElementById(this.targetId).removeChild(this.el);
    }

    render() {
        return createPortal(this.props.children, this.el);
    }
}

export default TrayElements;