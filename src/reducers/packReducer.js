export default function packReducer(state = null, action) {
  switch (action.type) {
    case 'pack/load':
      return { ...state, ...action.pack }
    case 'pack/setUploading':
      return { ...state, uploading: action.uploading }
    default:
      return state
  }
}
