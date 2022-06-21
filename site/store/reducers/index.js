import { combineReducers } from 'redux'
import userReducer from './usersReducer'
import makeUpProductsReducer from './makeUpReducer'

export default combineReducers({
  makeUpProducts: makeUpProductsReducer,
})
