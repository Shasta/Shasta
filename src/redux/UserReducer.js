import { USER } from './UserActions';

const initState = () => ({
    organization: localStorage.user,
    logged: localStorage.user ? true : false,
    verified: localStorage.user ? true : false
})

export default function(state = initState(), action) {
    const user = Object.assign({}, state);
    switch (action.type) {
        case USER.login.success:
        case USER.verify.success:
            user.organization = action.organization;
            user.verified = true;
            user.logged = true;
            return user;
        case USER.logout.success:
            user.organization = "";
            user.logged = false;
            return user;
        case USER.verify.error:
            user.verified = true;
            return user;
        default:
            return user;
    }
}