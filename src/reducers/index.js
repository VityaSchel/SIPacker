import { combineReducers, createStore } from 'redux'
import packReducer from './packReducer'
import dashboardReducer from './dashboardReducer'
import fileRenderingReducer from './fileRendering'

export default createStore(combineReducers({
  pack: packReducer,
  dashboard: dashboardReducer,
  fileRendering: fileRenderingReducer
}))
