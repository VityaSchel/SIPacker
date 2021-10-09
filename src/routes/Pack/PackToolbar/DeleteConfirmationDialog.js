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
    confirmPackDeletion() {
      return new Promise(resolve => {
        callback = resolve
        confirmationDialogRef.current
          .open('Вы уверены, что хотите удалить пак? Он будет удален безвозвратно.',
            'Удалить',
            <FormControlLabel control={
              <Checkbox defaultChecked value={value} onChange={e => setValue(e.target.value)} />
            } label='Удалить все связанные медиафайлы' />
          )
          .then(confirmed => {
            callback({ confirmed, deleteFiles: value })
          })
      })
    },

    confirmRoundDeletion() {
      return new Promise(resolve => {
        callback = resolve
        confirmationDialogRef.current
          .open('Вы уверены, что хотите удалить раунд? Все вопросы также будут удалены.', 'Удалить')
          .then(callback)
      })
    }
  }))

  return (
    <ConfirmationDialog ref={confirmationDialogRef}></ConfirmationDialog>
  )
})

DeleteConfirmationDialog.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
}

DeleteConfirmationDialog.displayName = 'DeleteConfirmationDialog'
export default DeleteConfirmationDialog
