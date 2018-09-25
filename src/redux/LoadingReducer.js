import { LOADING } from './LoadingActions';

const initState = false;

export default function(defaultState = initState, action) {
    const defaultLoading = defaultState;
    switch (action.type) {
        case LOADING.show:
          return true;
        case LOADING.hide:
          return false;
        default:
            return defaultLoading;
    }
}