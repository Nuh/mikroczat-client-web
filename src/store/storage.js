import {persistStore} from 'redux-persist'
import store from './store';

const storage = persistStore(store);

export default storage;