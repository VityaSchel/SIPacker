import { combineReducers, createStore } from 'redux'
import packReducer from './packReducer'
import dashboardReducer from './dashboardReducer'
import fileRenderingReducer from './fileRendering'
import menuReducer from './menuReducer'

export default createStore(combineReducers({
  pack: packReducer,
  dashboard: dashboardReducer,
  fileRendering: fileRenderingReducer,
  menu: menuReducer
}))
