import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from './reducers'

const initalState = {}

export default function createReduxStore(wrappers) {
  const middleWares = [thunk, ...wrappers]
  return createStore(
    rootReducer,
    initalState,
    composeWithDevTools(applyMiddleware(...middleWares))
  )
}
