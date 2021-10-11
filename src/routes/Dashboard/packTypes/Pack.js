import React from 'react'
import PropTypes from 'prop-types'
import styles from '../styles.module.scss'
import { MdDelete } from 'react-icons/md'
import ContextMenu from 'components/ContextMenu'
import { BiRename } from 'react-icons/bi'
import { formatDate } from '../../../utils'
import { componentsPropTypes } from '../../../consts'
import PackImage from './index'

Pack.propTypes = { pack: PropTypes.shape(componentsPropTypes.pack) }
export default function Pack(props) {
  const creationTime = formatDate(new Date(props.pack.creationTime))
  const contextMenu = React.useRef()

  const handleOpenMenu = e => {
    contextMenu.current && contextMenu.current.open(e)
  }

  return (
    <div
      className={[styles.packBase, styles.pack].join(' ')}
      onContextMenu={handleOpenMenu}
    >
      <ContextMenu ref={contextMenu}>{[
        { name: 'Переимновать', icon: <BiRename />, action: () => {} },
        { name: 'Удалить', icon: <MdDelete />, action: () => {} }
      ]}</ContextMenu>
      <PackImage src={props.pack.logo} />
      <div className={styles.info}>
        <span className={styles.name}>{props.pack.name}</span>
        <span className={styles.time}>Создано: {creationTime}</span>
      </div>
    </div>
  )
}
