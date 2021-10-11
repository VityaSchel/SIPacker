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

Pack.propTypes = { pack: PropTypes.shape(componentsPropTypes.pack) }
export default function Pack(props) {
  const confDialogRef = React.useRef()
  const dashboardActions = React.useContext(DashboardContext)
  const creationTime = formatDate(new Date(props.pack.creationTime))
  const contextMenuActions = React.useContext(ContextMenuActions)

  const handleOpenMenu = e => {
    contextMenuActions.open(e, [
      { name: 'Переимновать', icon: <BiRename />, action: () => {} },
      { name: 'Удалить', icon: <MdDelete />, action: () => handleDeletePack() }
    ])
  }

  const handleDeletePack = async () => {
    if(await confDialogRef.current.confirmPackDeletion(props.pack.uuid))
      dashboardActions.reloadPacks()
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
      </div>
    </>
  )
}
