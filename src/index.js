import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader'
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react'
import {ConnectedRouter} from 'connected-react-router'
import Loading from './components/Loading';
import App from './application';
import store, {history, storage} from './store';
import {load as loadConfiguration} from './configuration';

import 'normalize.css';
import './index.css';

const render = async () => {
    await loadConfiguration('/configuration.json');
    ReactDOM.render((
        <AppContainer>
            <Provider store={store}>
                <PersistGate loading={<Loading />} persistor={storage}>
                    <ConnectedRouter history={history}>
                        <App store={store}/>
                    </ConnectedRouter>
                </PersistGate>
            </Provider>
        </AppContainer>
    ), document.getElementById('root'));
};

render();

// Hot reloading
if (module.hot) {
    // Reload components
    module.hot.accept('./application', () => {
        render()
    });

    // Reload store
    module.hot.accept('./store', () => {
        render()
    });
}