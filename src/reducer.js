import { combineReducers } from 'redux'
import { drizzleReducers } from 'drizzle'
import userReducer from './redux/UserReducer.js';
const reducer = combineReducers({
  ...drizzleReducers,
  userReducer
})

export default reducer