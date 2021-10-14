export default function dashboardReducer(state = null, action) {
  switch (action.type) {
    case 'dashboard/setUploading':
      return { ...state, uploading: action.uploading }
    default:
      return state
  }
}
