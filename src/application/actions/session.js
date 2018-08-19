import {sessionService} from 'redux-react-session';
import * as auth from '../../api/auth';
import history from '../../store/history';

export const login = (strategy, token, redirect) =>
    () =>
        auth.login(strategy, token)
            .then((data) => {
                let token = data && data.token ? data.token : data;
                if (token) {
                    sessionService.saveSession({strategy: strategy, token: token})
                        .then(() => {
                            history.push(redirect || '/');
                        }).catch(err => console.error(err));
                } else {
                    history.push('/login', {reason: 'Failed authorization'});
                }
            });

export const logout = (redirect) =>
    () =>
        auth.logout()
            .then(async (/*result*/) => {
                sessionService.deleteSession();
                sessionService.deleteUser();
                history.push(redirect || '/');
            }).catch((err) => console.error(err));