import * as assignIn from 'lodash/assignIn';

export const parseToken = (data) => {
    try {
        let token = JSON.parse(Buffer.from(data.toString(), 'base64').toString());
        return assignIn(token, {raw: data});
    } catch (e) {
        throw new Error('Bad syntax of token');
    }
};

export const fetchToken = async (data) => await validateToken(data) ? data : null;
export const fetchProfile = async (data) => {
    return {};
};

export const validateToken = async (data) => {
    try {
        let token = parseToken(data);
        return token instanceof Object && token.appkey && token.login && token.token && token.sign;
    } catch (e) {
        console.error('Failed validating session token:', e)
    }
    return false;
};