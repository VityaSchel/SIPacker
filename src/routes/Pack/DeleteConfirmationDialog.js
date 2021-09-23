import React from 'react'
import PropTypes from 'prop-types'
import ConfirmationDialog from 'components/ConfirmationDialog'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

let callback
const DeleteConfirmationDialog = React.forwardRef((props, ref) => {
  const [value, setValue] = React.useState(false)
  const confirmationDialogRef = React.useRef()

  React.useImperativeHandle(ref, () => ({
    open() {
      return new Promise(resolve => {
        callback = resolve
        confirmationDialogRef.current.open().then(confirmed => {
          callback({ confirmed, deleteFiles: value })
        })
      })
    }
  }))

  return (
    <ConfirmationDialog ref={confirmationDialogRef}>
      <p>Вы уверены, что хотите удалить пак? Он будет удален безвозвратно.</p>
      <FormControlLabel control={
        <Checkbox defaultChecked value={value} onChange={e => setValue(e.target.value)} />
      } label='Удалить все связанные медиафайлы' />
    </ConfirmationDialog>
  )
})

DeleteConfirmationDialog.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
}

DeleteConfirmationDialog.displayName = 'DeleteConfirmationDialog'
export default DeleteConfirmationDialog
