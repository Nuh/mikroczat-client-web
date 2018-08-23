import {persistStore} from 'redux-persist'
import store from './store';

export const storage = persistStore(store);

export default storage;