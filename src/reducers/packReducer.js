export default function packReducer(state = null, action) {
  switch (action.type) {
    case 'pack/load':
      return action.pack
    default:
      return state
  }
}
