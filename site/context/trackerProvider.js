import { createContext, useCallback } from 'react'
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
    __DISABLE_SECURE_MODE:
      config?.__DISABLE_SECURE_MODE ||
      process.env.NEXT_PUBLIC_OPENREPLAY_DISABLE_SECURE_MODE,
    verbose: true,
    __debug__: true,
  }
  if (config?.ingestPoint || process.env.NEXT_PUBLIC_OPENREPLAY_INGEST_POINT) {
    trackerConfig.ingestPoint =
      config?.ingestPoint || process.env.NEXT_PUBLIC_OPENREPLAY_INGEST_POINT
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
        let pluginsReturnedValue = {}
        if (state.config.plugins) {
          state.config.plugins.forEach((p) => {
            console.log('Using plugin...')
            pluginsReturnedValue[p.name] = t.use(p.fn(p.config))
          })
        }
        return {
          ...state,
          pluginsReturnedValue: pluginsReturnedValue,
          tracker: t,
        }
      }
      return state
    }
    case 'usePlugin': {
      state.tracker.use(action.payload)
      return state
    }
    case 'start': {
      console.log('Starting tracker...')
      state.tracker.start()
      return state
    }
    case 'logEvent': {
      console.log('Logging event')
      state.tracker?.event(action.payload?.name, action.payload?.data)
      return state
    }
    case 'logIssue': {
      console.log('Logging issue')
      state.tracker?.issue(action.payload?.name, action.payload?.data)
      return state
    }
    case 'setMetadata': {
      state.tracker.setMetadata(action.payload.key, '' + action.payload.value)
      return state
    }
  }
}
export default function TrackerProvider({ children, config = {} }) {
  let [state, dispatch] = useReducer(reducer, {
    tracker: null,
    pluginsReturnedValue: {},
    config,
  })
  let value = {
    startTracking: () => dispatch({ type: 'start' }),
    usePlugin: (plugin) => dispatch({ type: 'usePlugin', payload: plugin }),
    initTracker: () => dispatch({ type: 'init' }),
    logEvent: (evnt) => dispatch({ type: 'logEvent', payload: evnt }),
    logIssue: (evnt) => dispatch({ type: 'logIssue', payload: evnt }),
    setMetadata: (key, value) =>
      dispatch({ type: 'setMetadata', payload: { key, value } }),
    pluginsReturnedValues: { ...state.pluginsReturnedValue },
  }
  return (
    <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
  )
}
