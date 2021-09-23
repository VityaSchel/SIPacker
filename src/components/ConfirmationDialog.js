import React from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MuiDialog from '@mui/material/Dialog'

let okCallback
const ConfirmationDialog = React.forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false)

  const handleAction = result => {
    setOpen(false)
    okCallback(result)
  }

  React.useImperativeHandle(ref, () => ({
    open() {
      return new Promise(resolve => {
        okCallback = resolve
        setOpen(true)
      })
    }
  }))

  return (
    <MuiDialog
      maxWidth="xs"
      open={open}
      onClose={() => handleAction(false)}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {props.children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => handleAction(false)} color="primary">
          Отмена
        </Button>
        <Button onClick={() => handleAction(true)} color="primary">
          Продолжить
        </Button>
      </DialogActions>
    </MuiDialog>
  )
})

ConfirmationDialog.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node
}
ConfirmationDialog.displayName = 'ConfirmationDialog'
export default ConfirmationDialog
