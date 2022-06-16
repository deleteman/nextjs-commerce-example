import { createContext } from 'react'
import Tracker from '@openreplay/tracker'
import { v4 as uuidV4 } from 'uuid'
import { useReducer } from 'react'

export const TrackerContext = createContext()
function defaultGetUserId() {
  return uuidV4()
}
function newTracker(config) {
  const getUserId =
    config?.userIdEnabled && config?.getUserId
      ? config.getUserId
      : defaultGetUserId
  let userId = null
  const trackerConfig = {
    projectKey:
      config?.projectKey || process.env.NEXT_PUBLIC_OPENREPLAY_PROJECT_KEY,
  }

  console.log('Tracker configuration: ')
  console.log(trackerConfig)
  const tracker = new Tracker(trackerConfig)
  if (config?.userIdEnabled) {
    userId = getUserId()
    tracker.setUserID(userId)
  }
  return tracker
}
function reducer(state, action) {
  switch (action.type) {
    case 'init': {
      if (!state.tracker) {
        console.log('Instantiaing the tracker for the first time...')
        let t = newTracker(state.config)
        if (state.config.plugins) {
          state.config.plugins.forEach((p) => {
            console.log('Using plugin...')
            console.log(p)
            t.use(p.fn(p.config))
          })
        }
        //t.use(trackerAxios(options)); // check list of available options below

        return { ...state, tracker: t }
      }
      return state
    }
    case 'start': {
      console.log('Starting tracker...')
      console.log(state.tracker)
      state.tracker.start()
      return state
    }
  }
}
export default function TrackerProvider({ children, config = {} }) {
  let [state, dispatch] = useReducer(reducer, { tracker: null, config })
  let value = {
    startTracking: () => dispatch({ type: 'start' }),
    initTracker: () => dispatch({ type: 'init' }),
  }
  return (
    <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
  )
}
