import * as wykop from './wykop';

const strategies = {
    wykop
};

export const login = async (strategy, data) => {
    let module = strategies[strategy];
    if (module) {
        return {
            strategy,
            token: await module.fetchToken(data),
        }
    }
};

export const logout = async () => {
    return true;
};

export const validateToken = async (strategy, token) => {
    let module = strategies[strategy];
    if (module) {
        return await module.validateToken(token);
    }
};