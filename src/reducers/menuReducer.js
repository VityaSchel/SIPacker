export default function menuReducer(state = null, action) {
  switch (action.type) {
    case 'menu/setPosition':
      return { ...state, position: action.position }
    default:
      return state
  }
}
