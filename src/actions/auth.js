import {sessionService} from 'redux-react-session';
import * as sessionApi from '../api/auth';

import history from '../store/history';

export const login = (strategy, token, redirect) =>
    () =>
        sessionApi.login(strategy, token)
            .then((data) => {
                if (data instanceof Object && data.token && data.profile) {
                    sessionService.saveSession({strategy: strategy, token: data.token})
                        .then(() => sessionService.saveUser(data.profile))
                        .then(() => {
                            history.push(redirect || '/');
                        }).catch(err => console.error(err));
                } else {
                    history.push('/login', {reason: 'Failed authorization'});
                }
            });

export const logout = (redirect) =>
    () =>
        sessionApi.logout()
            .then((/*result*/) => {
                sessionService.deleteSession();
                sessionService.deleteUser();
                history.push(redirect || '/');
            }).catch((err) => console.error(err));