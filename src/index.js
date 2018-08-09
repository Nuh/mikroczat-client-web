import registerServiceWorker from './registerServiceWorker';
import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader'
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react'
import App from './application';
import store, {history, storage} from './store';
import {load as loadConfiguration} from './configuration';
import 'normalize.css';

const render = async () => {
    await loadConfiguration('/configuration.json');
    ReactDOM.render((
        <AppContainer>
            <Provider store={store}>
                <PersistGate loading={null} persistor={storage}>
                    <App history={history} store={store}/>
                </PersistGate>
            </Provider>
        </AppContainer>
    ), document.getElementById('root'));
};

registerServiceWorker();
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