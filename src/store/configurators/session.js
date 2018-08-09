import {sessionService} from "redux-react-session";
import {validateToken} from "../../api/auth";

// Initialize session
const validateSession = async (session) => {
    return session instanceof Object && session.token && await validateToken(session.strategy, session.token);
};

export default (store) =>
    sessionService.initSessionService(store, {
        refreshOnCheckAuth: true,
        validateSession
    });