import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from './reducers'

const initalState = {}

export default function createReduxStor(extraMiddleware = []) {
  const middleware = [thunk, ...extraMiddleware]

  const store = createStore(
    rootReducer,
    initalState,
    composeWithDevTools(applyMiddleware(...middleware))
  )
  return store
}

//export default store
