import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

export const ContextMenuActions = React.createContext({})
function ContextMenu(props) {
  const [items, setItems] = React.useState()

  const contextMenu = {
    open(e, items) {
      if(props.menu?.position) return true
      else e.preventDefault()
      setItems(items)
      props.dispatch({ type: 'menu/setPosition', position: [e.clientX, e.clientY] })
      return false
    }
  }

  const close = e => {
    e?.preventDefault()
    props.dispatch({ type: 'menu/setPosition', position: null })
  }

  const handleSelect = action => e => {
    e.stopPropagation()
    action()
    close()
  }

  return (
    <>
      <ContextMenuActions.Provider value={contextMenu}>
        {props.children}
      </ContextMenuActions.Provider>
      {
        ReactDOM.createPortal(
          <Menu
            open={props.menu?.position}
            anchorReference='anchorPosition'
            anchorPosition={props.menu?.position && { top: props.menu.position[1], left: props.menu.position[0] }}
            onClose={close}
          >
            {items?.map((item, i) =>
              <MenuItem onClick={handleSelect(item.action)} key={i}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText>{item.name}</ListItemText>
              </MenuItem>
            )}
          </Menu>,
          document.body
        )
      }
    </>
  )
}

ContextMenu.displayName = 'ContextMenu'
ContextMenu.propTypes = {
  dispatch: PropTypes.func,
  menu: PropTypes.array,
  name: PropTypes.string,
  children: PropTypes.func,
}

export default connect(state => ({ menu: state.menu }))(ContextMenu)
