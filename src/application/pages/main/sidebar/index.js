import PropTypes from "prop-types";
import React, {Component} from 'react';

import {TabPanel, TabView} from 'primereact/tabview';
import 'primereact/components/tabview/TabView.css';

import {ScrollPanel} from 'primereact/scrollpanel';
import 'primereact/components/scrollpanel/ScrollPanel.css';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUsers, faDoorClosed} from '@fortawesome/free-solid-svg-icons'

import Users from './Users';
import Channels from './Channels';

import './index.css';

class Sidebar extends Component {
    static contextTypes = {store: PropTypes.object};
    static propTypes = {channel: PropTypes.object};

    render() {
        let {channel} = this.props;
        return (
            <div className="sidebar">
                {channel ? (
                    <TabView>
                        <TabPanel header={(
                            <span><FontAwesomeIcon icon={faUsers} transform="shrink-3 left-3 down-1"/>Users</span>
                        )}>
                            <ScrollPanel>
                                <Users channel={channel}/>
                            </ScrollPanel>
                        </TabPanel>
                        <TabPanel header={(
                            <span><FontAwesomeIcon icon={faDoorClosed} transform="shrink-3 left-3 down-1"/>Channels</span>
                        )}>
                            <ScrollPanel>
                                <Channels chosen={channel}/>
                            </ScrollPanel>
                        </TabPanel>
                    </TabView>
                ) : (
                    <TabView>
                        <TabPanel header={(
                            <span><FontAwesomeIcon icon={faDoorClosed} transform="shrink-3 left-3 down-1"/>Channels</span>
                        )}>
                            <ScrollPanel>
                                <Channels chosen={channel}/>
                            </ScrollPanel>
                        </TabPanel>
                    </TabView>
                )}
            </div>
        );
    }
}

export default Sidebar;