import { combineReducers, createStore } from 'redux'
import packReducer from './packReducer'
import dashboardReducer from './dashboardReducer'

export default createStore(combineReducers({
  pack: packReducer,
  dashboard: dashboardReducer
}))
