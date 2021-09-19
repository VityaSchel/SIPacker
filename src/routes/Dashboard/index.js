import React from 'react'
import styles from './styles.module.scss'
import PropTypes from 'prop-types'
import { componentsPropTypes } from '../../consts.js'
import cx from 'classnames'
import { BsPlus } from 'react-icons/bs'
import { MdFileUpload } from 'react-icons/md'
import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <LocalPacks />
  )
}

function LocalPacks() {
  const [savedLocalPacks, setSavedLocalPacks] = React.useState()

  return (
    <div className={styles.packsList}>
      <PackBase type='create' />
      <PackBase type='upload' />
      { savedLocalPacks
        ? savedLocalPacks.map(pack => <PackBase type='pack' key={pack.uuid} pack={pack} />)
        : <><PackBase type='loading' /><PackBase type='loading' /><PackBase type='loading' /></>
      }
    </div>
  )
}

PackBase.propTypes = {
  type: PropTypes.oneOf(['create', 'upload', 'pack', 'loading']),
  pack: PropTypes.shape(componentsPropTypes.pack)
}

function PackBase(props) {
  return (
    props.type === 'loading'
      ? <Pack {...props} />
      : <Link to={props.type === 'pack' ? `/${props.pack.uuid}` : `/${props.type}` }>
          <Pack {...props} />
        </Link>
  )
}

function Pack(props) {
  return (
    <div className={cx(
      styles.packBase,
      {
        [styles.newPack]: ['create', 'upload'].includes(props.type),
        [styles.loading]: props.type === 'loading'
      }
    )}>
      {
        {
          'create': <span><BsPlus /> Создать новый пак</span>,
          'upload': <span><MdFileUpload /> Загрузить файл пака</span>,
          'loading': <Skeleton variant='rectangular' width='100%' height='100%' />
        }[props.type]
      }
    </div>
  )
}
