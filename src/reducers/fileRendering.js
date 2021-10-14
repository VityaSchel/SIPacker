export default function fileRenderingReducer(state = {}, action) {
  switch (action.type) {
    case 'fileRendering/fileRenderingStarted':
      return state[action.fileURI] ? { ...state } :  { ...state, [action.fileURI]: action.callback }
    case 'fileRendering/fileRenderingStopped':
      return removeFileURI(state, action.fileURI)
    case 'fileRendering/fileUnlinked':
      const callback = state[action.fileURI]
      callback && callback()
      return removeFileURI(state, action.fileURI)
    case 'fileRendering/setFileUnlinkCallback':
      return changeProperty(state, action.fileURI, action.callback)
    default:
      return state
  }
}

function removeFileURI(state, fileURI) {
  const newState = { ...state }
  delete newState[fileURI]
  return newState
}

function changeProperty(state, propertyName, newValue) {
  const newState = { ...state }
  newState[propertyName] = newValue
  return newState
}
