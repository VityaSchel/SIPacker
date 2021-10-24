import React from 'react'
import PropTypes from 'prop-types'
import ConfirmationDialog from 'components/ConfirmationDialog'
import { deleteFilesOfPack, getAllURIsFromPack } from 'localStorage/fileStorage'
import { deleteLocalPack, saveLocalPack } from 'localStorage/localPacks'
import { useHistory } from 'react-router-dom'
import store from 'reducers/index'
import { mapPackState } from 'utils'
import { connect } from 'react-redux'

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
    },

    async confirmDeleteQuestion(round, themeIndex, questionPrice) {
      const { confirmed } = await confirmationDialogRef.current
        .open('Вы уверены, что хотите удалить вопрос?', 'Удалить')
      if(!confirmed) return false
      const pack = { ...props.pack }

      questionPrice = parseInt(questionPrice)
      const theme = props.pack.rounds[round].themes[themeIndex]
      const questionIndex = theme.questions.findIndex(({ price }) => price === Number(questionPrice))
      theme.questions.splice(questionIndex, 1)
      theme.questions = theme.questions.sort((a, b) => a.price - b.price)
      await saveLocalPack(pack)
      props.dispatch({ type: 'pack/load', pack: pack })
      return true
    }
  }))

  return (
    <ConfirmationDialog ref={confirmationDialogRef} />
  )
})

DeleteConfirmationDialog.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  pack: PropTypes.object,
  dispatch: PropTypes.func
}

DeleteConfirmationDialog.displayName = 'DeleteConfirmationDialog'
export default connect(mapPackState, null, null, { forwardRef: true })(DeleteConfirmationDialog)
