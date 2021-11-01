import React from 'react'
import PropTypes from 'prop-types'
import styles from '../styles.module.scss'
import { MdDelete } from 'react-icons/md'
import { ContextMenuActions } from 'components/ContextMenu'
import { BiRename } from 'react-icons/bi'
import { formatDate } from '../../../utils'
import { componentsPropTypes } from '../../../consts'
import PackImage from './index'
import DeleteConfirmationDialog from 'components/ConfirmationDialog/DeleteConfirmationDialog'
import { DashboardContext } from '../index'
import RenameDialog from 'components/RenameDialog'
import { loadLocalPack, saveLocalPack } from 'localStorage/localPacks'

Pack.propTypes = { pack: PropTypes.shape(componentsPropTypes.pack) }
export default function Pack(props) {
  const confDialogRef = React.useRef()
  const renameDialog = React.useRef()
  const dashboardActions = React.useContext(DashboardContext)
  const creationTime = formatDate(new Date(props.pack.creationTime))
  const contextMenuActions = React.useContext(ContextMenuActions)

  const handleOpenMenu = e => {
    contextMenuActions.open(e, [
      { name: 'Переименовать', icon: <BiRename />, action: () => handleRenamePack() },
      { name: 'Удалить', icon: <MdDelete />, action: () => handleDeletePack() }
    ])
  }

  const handleDeletePack = () => {
    confDialogRef.current.confirmPackDeletion(props.pack.uuid).then(confirmed => confirmed && dashboardActions.reloadPacks())
  }

  const handleRenamePack = async () => {
    const newName = await new Promise(resolve =>
      renameDialog.current.askToRename(resolve, 'пак', props.pack.name)
    )
    if(newName !== undefined){
      let pack = await loadLocalPack(props.pack.uuid)
      pack = { ...pack, name: newName }
      saveLocalPack(pack)
      dashboardActions.reloadPacks()
    }
  }

  return (
    <>
      <div
        className={[styles.packBase, styles.pack].join(' ')}
        onContextMenu={handleOpenMenu}
      >
        <PackImage src={props.pack.logo} />
        <div className={styles.info}>
          <span className={styles.name}>{props.pack.name}</span>
          <span className={styles.time}>Создано: {creationTime}</span>
        </div>
      </div>
      <div onClick={e => e.stopPropagation()}>
        <DeleteConfirmationDialog ref={confDialogRef} />
        <RenameDialog ref={renameDialog} />
      </div>
    </>
  )
}
