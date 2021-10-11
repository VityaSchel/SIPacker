import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

const ContextMenu = React.forwardRef((props, ref) => {
  console.log(props)

  React.useImperativeHandle(ref, () => ({
    open(e) {
      console.log(e)
      if(props.menu?.position) return true
      else e.preventDefault()
      console.log(e.clientX, e.clientY);
      props.dispatch({ type: 'menu/setPosition', position: [e.clientX, e.clientY] })
      return false
    }
  }))

  const close = e => {
    e?.preventDefault()
    console.log('closing');
    props.dispatch({ type: 'menu/setPosition', position: null })
  }

  const handleSelect = action => e => {
    e.stopPropagation()
    action()
    close()
  }

  return (
    <>
      {
        props.menu?.position && ReactDOM.createPortal(
          <Menu
            open={props.menu?.position}
            anchorReference="anchorPosition"
            anchorPosition={{ top: props.menu?.position[1], left: props.menu?.position[0] }}
            onClose={close}
          >
            {props.children.map((item, i) =>
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
})

ContextMenu.displayName = 'ContextMenu'
ContextMenu.propTypes = {
  dispatch: PropTypes.func,
  menu: PropTypes.array,
  children: PropTypes.array
}

export default connect(state => ({ menu: state.menu }), null, null, { forwardRef: true })(ContextMenu)
