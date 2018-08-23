import {SET_STATE, TOGGLE_STATE, REMOVE_STATE} from '../actions/settings'

export default (state = {state: {}}, data) => {
    switch (data.type) {
        case SET_STATE:
            state.state[data.key] = data.value;
            return state;

        case TOGGLE_STATE:
            state.state[data.key] = data.defaultState ? state.state[data.key] === false : !state.state[data.key];
            return state;

        case REMOVE_STATE:
            delete state.state[data.key];
            return state;

        default:
            return state;
    }
}