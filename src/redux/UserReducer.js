import { USER } from './UserActions';

const userDefault = {
    organization: '',
    logged: false,
    verified: false
}

export default function(state = userDefault, action) {
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