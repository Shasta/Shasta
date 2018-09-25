import { combineReducers } from 'redux'
import { drizzleReducers } from 'drizzle'
import userReducer from './redux/UserReducer.js';
import isAppLoading from './redux/LoadingReducer.js';

const reducer = combineReducers({
  ...drizzleReducers,
  userReducer,
  isAppLoading
})

export default reducer