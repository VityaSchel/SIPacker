import React from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MuiDialog from '@mui/material/Dialog'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

let okCallback
const ConfirmationDialog = React.forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false)
  const [text, setText] = React.useState()
  const [confirmText, setConfirmText] = React.useState('')
  const [checkboxText, setCheckboxText] = React.useState('')
  const [checkboxValue, setCheckboxValue] = React.useState(true)

  const handleAction = result => {
    setOpen(false)
    okCallback({ confirmed: result, checked: checkboxValue })
  }

  React.useImperativeHandle(ref, () => ({
    open(text, confirmText, checkboxText) {
      return new Promise(resolve => {
        okCallback = resolve
        setOpen(true)
        setText(text)
        setConfirmText(confirmText)
        setCheckboxText(checkboxText)
      })
    }
  }))

  return (
    <MuiDialog
      maxWidth='xs'
      open={open}
      onClose={() => handleAction(false)}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {text && <p>{text}</p>}
          {props.children}
          {checkboxText && <FormControlLabel control={
            <Checkbox
              defaultChecked
              value={checkboxValue}
              onChange={e => setCheckboxValue(e.target.checked)}
            />
          } label={checkboxText} />}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => handleAction(false)} color='primary'>
          Отмена
        </Button>
        <Button onClick={() => handleAction(true)} color='primary'>
          {confirmText ?? 'Продолжить'}
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
