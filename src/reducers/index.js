import { combineReducers, createStore } from 'redux'
import packReducer from './packReducer'

export default createStore(combineReducers({
  pack: packReducer
}))
