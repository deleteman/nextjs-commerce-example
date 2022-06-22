import { combineReducers } from 'redux'
import makeUpProductsReducer from './makeUpReducer'

export default combineReducers({
  makeUpProducts: makeUpProductsReducer,
})
