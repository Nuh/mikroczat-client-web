export const SET_STATE = 'SET_STATE';
export const TOGGLE_STATE = 'TOGGLE_STATE';
export const REMOVE_STATE = 'REMOVE_STATE';

export const setState = (key, value) =>
    ({type: SET_STATE, key, value});

export const toggleState = (key, defaultState) =>
    ({type: TOGGLE_STATE, key, defaultState});

export const removeState = (key) =>
    ({type: REMOVE_STATE, key});