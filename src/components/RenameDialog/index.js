import React from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MuiDialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'

const RenameDialog = React.forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false)
  const [callback, setCallback] = React.useState(() => () => {})
  const [subject, setSubject] = React.useState('')
  const [oldName, setOldName] = React.useState('')
  const [value, setValue] = React.useState('')

  React.useImperativeHandle(ref, () => ({
    askToRename(callback, subject, oldName) {
      setCallback(() => callback)
      setSubject(subject)
      setOldName(oldName)
      setValue(oldName)
      setOpen(true)
    }
  }))

  const handleCancel = () => {
    setOpen(false)
    callback()
  }

  const handleRename = () => {
    setOpen(false)
    callback(value)
  }

  return (
    <MuiDialog
      maxWidth='xs'
      open={open}
      onClose={handleCancel}
    >
      <DialogTitle>Переименовать {subject}</DialogTitle>
      <DialogContent>
        <TextField
          label='Новое имя'
          placeholder={oldName}
          variant='outlined'
          value={value}
          onChange={e => setValue(e.target.value)}
          style={{ marginTop: 15 }}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Отмена
        </Button>
        <Button onClick={handleRename} color="primary" disabled={!value.length}>
          Переименовать
        </Button>
      </DialogActions>
    </MuiDialog>
  )
})

RenameDialog.displayName = 'RenameDialog'

export default RenameDialog
