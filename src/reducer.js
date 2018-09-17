import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { drizzleReducers } from 'drizzle'
import userReducer from './redux/UserReducer.js';
const reducer = combineReducers({
  routing: routerReducer,
  ...drizzleReducers,
  userReducer
})

export default reducer