import React from 'react'
import PropTypes from 'prop-types'
import ConfirmationDialog from 'components/ConfirmationDialog'
import { deleteFilesOfPack, getAllURIsFromPack } from 'localStorage/fileStorage'
import { deleteLocalPack } from 'localStorage/localPacks'
import { useHistory } from 'react-router-dom'
import store from 'reducers/index'

const DeleteConfirmationDialog = React.forwardRef((props, ref) => {
  const confirmationDialogRef = React.useRef()
  const history = useHistory()

  React.useImperativeHandle(ref, () => ({
    async confirmPackDeletion(packUUID) {
      const { confirmed, checked } = await confirmationDialogRef.current
        .open('Вы уверены, что хотите удалить пак? Он будет удален безвозвратно.',
          'Удалить',
          'Удалить все связанные медиафайлы'
        )
      const deleteFiles = checked
      if(confirmed) {
        if(deleteFiles) {
          const fileURIs = await getAllURIsFromPack(packUUID)
          fileURIs.forEach(fileURI => store.dispatch({ type: 'fileRendering/fileUnlinked', fileURI }))
          await deleteFilesOfPack(packUUID)
        }
        await deleteLocalPack(packUUID)
        history.push('/')
      }
      return confirmed
    },

    async confirmRoundDeletion() {
      const { confirmed } = await confirmationDialogRef.current
        .open('Вы уверены, что хотите удалить раунд? Все вопросы также будут удалены.', 'Удалить')
      return confirmed
    }
  }))

  return (
    <ConfirmationDialog ref={confirmationDialogRef} />
  )
})

DeleteConfirmationDialog.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
}

DeleteConfirmationDialog.displayName = 'DeleteConfirmationDialog'
export default DeleteConfirmationDialog
