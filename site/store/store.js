import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from './reducers'

const initalState = {}

export default function createReduxStore(extraMiddleware = []) {
  const middleware = [thunk, ...extraMiddleware]
  console.log(
    'Creating the new redux store with ',
    middleware.length,
    ' middlewares'
  )

  const store = createStore(
    rootReducer,
    initalState,
    composeWithDevTools(applyMiddleware(...middleware))
  )
  return store
}

//export default store
