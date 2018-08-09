import store from './store';
import history from './history';
import storage from './storage';
import sessionConfigure from './configurators/session';

sessionConfigure(store);

export {
    store as default,
    history,
    storage
};