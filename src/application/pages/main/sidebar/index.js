import PropTypes from "prop-types";
import React, {Component} from 'react';

import {TabView, TabPanel} from 'primereact/tabview';
import 'primereact/components/tabview/TabView.css';

import {ScrollPanel} from 'primereact/scrollpanel';
import 'primereact/components/scrollpanel/ScrollPanel.css';

import Users from './Users';
import Channels from './Channels';

import './index.css';

class Sidebar extends Component {
    static contextTypes = {store: PropTypes.object};
    static propTypes = {chosen: PropTypes.string.isRequired};

    render() {
        return (
            <div className="sidebar">
                <TabView>
                    {this.props.chosen && (
                        <TabPanel header="Users" leftIcon="fas fa-calendar">
                            <ScrollPanel>
                                <Users chosen={this.props.chosen}/>
                            </ScrollPanel>
                        </TabPanel>
                    )}
                    <TabPanel header="Channels" leftIcon="fas fa-user">
                        <ScrollPanel>
                            <Channels chosen={this.props.chosen}/>
                        </ScrollPanel>
                    </TabPanel>
                </TabView>
            </div>
        );
    }
}

export default Sidebar;